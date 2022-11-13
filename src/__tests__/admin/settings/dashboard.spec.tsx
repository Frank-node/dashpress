import "@testing-library/jest-dom";
import React from "react";
import { render, screen, within } from "@testing-library/react";
import { AppWrapper } from "@hadmean/chromista";

import ManageDashboard from "pages/admin/settings/dashboard";

import { setupApiHandlers } from "__tests__/_/setupApihandlers";

setupApiHandlers();

jest.mock("next/router", () => require("next-router-mock"));

describe.skip("pages/admin/settings/dashboard", () => {
  it("should render dashboard widgets correctly", async () => {
    render(
      <AppWrapper>
        <ManageDashboard />
      </AppWrapper>
    );

    const layoutContent = screen.getByTestId("app-layout__content");

    expect(
      await within(layoutContent).findByText("Table Widget 1")
    ).toBeInTheDocument();

    expect(
      await within(layoutContent).findByText("Summary Widget 1")
    ).toBeInTheDocument();
  });

  // Should create summary card widget
  // Should create table widget
  // Should delete card and table
  // Should update card and table
  // Should re-arrange card and table
});