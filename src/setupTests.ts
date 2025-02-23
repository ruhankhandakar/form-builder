import '@testing-library/jest-dom';

declare global {
  interface Window {
    indexedDB: IDBFactory;
  }
}

const mockIndexedDB: Partial<IDBFactory> = {
  open: jest
    .fn()
    .mockImplementation(() => ({} as IDBOpenDBRequest)) as jest.Mock<
    IDBOpenDBRequest,
    [name: string, version?: number]
  >,
};

(global as any).indexedDB = mockIndexedDB;

// Clear mocks between tests
beforeEach(() => {
  (mockIndexedDB.open as jest.Mock).mockClear();
});

export {};
