import '@testing-library/jest-dom';

declare global {
  var indexedDB: {
    open: jest.Mock;
  };
}

const mockIndexedDB = {
  open: jest.fn(),
};

(global as any).indexedDB = mockIndexedDB;

// Clear mocks between tests
beforeEach(() => {
  mockIndexedDB.open.mockClear();
});

export {};
