// src/__tests__/home.test.tsx
import { describe, it } from '@jest/globals';
import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import HomePage from "@/app/page";


jest.mock('@tensorflow-models/coco-ssd', () => ({
  load: jest.fn().mockResolvedValue({}),
}));

describe("HomePage component", () => {
  it('should set loading state to false when model is successfully loaded', async () => {
    const { getByText } = render(<HomePage />);
    await waitFor(() => expect(getByText('Loading...')).not.toBeInTheDocument());
  });
});