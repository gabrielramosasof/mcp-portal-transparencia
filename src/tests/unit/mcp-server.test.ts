import { MCPPortalServer } from '../../mcp-server';
import { SwaggerLoader } from '../../core/SwaggerLoader';
import { Authentication } from '../../core/Authentication';
import { Logger } from '../../logging/Logger';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

// Mock external dependencies
jest.mock('../../core/SwaggerLoader');
jest.mock('../../core/Authentication');
jest.mock('../../logging/Logger');
jest.mock('@modelcontextprotocol/sdk/server/index.js');
jest.mock('@modelcontextprotocol/sdk/server/stdio.js');
jest.mock('node-fetch', () => jest.fn()); // Mock node-fetch

describe('MCPPortalServer', () => {
  let mcpServer: MCPPortalServer;
  let mockSwaggerLoader: jest.Mocked<SwaggerLoader>;
  let mockAuthentication: jest.Mocked<Authentication>;
  let mockLogger: jest.Mocked<Logger>;
  let mockServer: jest.Mocked<Server>;
  let mockStdioServerTransport: jest.Mocked<StdioServerTransport>;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();

    // Cast mocks to their respective types
    mockSwaggerLoader = SwaggerLoader.mock.instances[0] as jest.Mocked<SwaggerLoader>;
    mockAuthentication = Authentication.mock.instances[0] as jest.Mocked<Authentication>;
    mockLogger = Logger.mock.instances[0] as jest.Mocked<Logger>;
    mockServer = Server.mock.instances[0] as jest.Mocked<Server>;
    mockStdioServerTransport = StdioServerTransport.mock.instances[0] as jest.Mocked<StdioServerTransport>;

    // Mock implementation for SwaggerLoader and Authentication
    mockSwaggerLoader = {
      loadSpec: jest.fn().mockResolvedValue({ paths: {} }),
    } as any;
    (SwaggerLoader as jest.Mock).mockImplementation(() => mockSwaggerLoader);

    mockAuthentication = {
      getAuthHeaders: jest.fn().mockReturnValue({ 'X-API-Key': 'test-api-key' }),
    } as any;
    (Authentication as jest.Mock).mockImplementation(() => mockAuthentication);

    mockLogger = {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    } as any;
    (Logger as jest.Mock).mockImplementation(() => mockLogger);

    mockServer = {
      setRequestHandler: jest.fn(),
      connect: jest.fn().mockResolvedValue(undefined),
    } as any;
    (Server as jest.Mock).mockImplementation(() => mockServer);

    mockStdioServerTransport = {
      connect: jest.fn().mockResolvedValue(undefined),
    } as any;
    (StdioServerTransport as jest.Mock).mockImplementation(() => mockStdioServerTransport);

    // Create a new instance of MCPPortalServer for each test
    mcpServer = new MCPPortalServer();
  });

  describe('constructor', () => {
    it('should initialize Logger, Server, Authentication, and SwaggerLoader', () => {
      expect(Logger).toHaveBeenCalledTimes(1);
      expect(Server).toHaveBeenCalledTimes(1);
      expect(Authentication).toHaveBeenCalledTimes(1);
      expect(SwaggerLoader).toHaveBeenCalledTimes(1);
    });

    it('should set up request handlers', () => {
      expect(mockServer.setRequestHandler).toHaveBeenCalledTimes(3);
    });
  });

  describe('initialize', () => {
    it('should load Swagger spec and generate MCP tools', async () => {
      await mcpServer.initialize();
      expect(mockSwaggerLoader.loadSpec).toHaveBeenCalledTimes(1);
      expect(mockLogger.info).toHaveBeenCalledWith('Iniciando carregamento da especificação Swagger...');
      expect(mockLogger.info).toHaveBeenCalledWith('Especificação carregada, gerando ferramentas MCP...');
      expect(mockLogger.info).toHaveBeenCalledWith(expect.stringContaining('Servidor MCP inicializado com'));
    });

    it('should handle errors during Swagger spec loading', async () => {
      const error = new Error('Failed to load spec');
      mockSwaggerLoader.loadSpec.mockRejectedValueOnce(error);

      await expect(mcpServer.initialize()).rejects.toThrow('Failed to load spec');
      expect(mockLogger.error).toHaveBeenCalledWith('Falha ao inicializar servidor MCP', { error: error.message });
    });
  });

  describe('start', () => {
    it('should connect the server', async () => {
      await mcpServer.start();
      expect(mockServer.connect).toHaveBeenCalledTimes(1);
      expect(mockLogger.info).toHaveBeenCalledWith('Servidor MCP Portal da Transparência iniciado com sucesso');
    });

    it('should handle errors during server connection', async () => {
      const error = new Error('Connection failed');
      mockServer.connect.mockRejectedValueOnce(error);

      await expect(mcpServer.start()).rejects.toThrow('Connection failed');
      expect(mockLogger.error).toHaveBeenCalledWith('Falha ao iniciar servidor MCP', { error: error.message });
    });
  });

  // Test for main function (requires mocking process.argv and process.exit)
  describe('main', () => {
    let originalArgv: string[];
    let originalExit: (code?: number) => never;

    beforeAll(() => {
      originalArgv = process.argv;
      originalExit = process.exit;
      // Mock process.exit to prevent actual exit during tests
      (process as any).exit = jest.fn();
    });

    afterAll(() => {
      process.argv = originalArgv;
      process.exit = originalExit;
    });

    it('should initialize and start the server', async () => {
      // Mock the main function to be called
      process.argv = ['node', 'mcp-server.ts']; // Simulate direct execution
      jest.spyOn(MCPPortalServer.prototype, 'initialize').mockResolvedValueOnce(undefined);
      jest.spyOn(MCPPortalServer.prototype, 'start').mockResolvedValueOnce(undefined);

      // Dynamically import the module to trigger the main function
      await import('../../mcp-server');

      expect(MCPPortalServer.prototype.initialize).toHaveBeenCalledTimes(1);
      expect(MCPPortalServer.prototype.start).toHaveBeenCalledTimes(1);
      expect(process.exit).not.toHaveBeenCalled();
    });

    it('should handle errors during main execution', async () => {
      const error = new Error('Main execution error');
      jest.spyOn(MCPPortalServer.prototype, 'initialize').mockRejectedValueOnce(error);
      jest.spyOn(process.stderr, 'write').mockImplementation(jest.fn()); // Mock stderr.write

      // Dynamically import the module to trigger the main function
      await import('../../mcp-server');

      expect(MCPPortalServer.prototype.initialize).toHaveBeenCalledTimes(1);
      expect(process.stderr.write).toHaveBeenCalledWith(expect.stringContaining('Erro ao iniciar servidor MCP'));
      expect(process.exit).toHaveBeenCalledWith(1);
    });
  });
});
