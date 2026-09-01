// @vitest-environment jsdom
import React from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { FormPage } from "./FormPage";
import { renderControl } from "./controlRenderers";
import { ShellsProvider } from "../../context/ShellsContext";
import type { ComponentMap, FormPageConfig } from "../../types";

const components: ComponentMap = {
  Table: () => null,
  Button: ({ label, onClick, disabled }) => (
    <button type="button" onClick={onClick} disabled={disabled}>
      {label}
    </button>
  ),
  Input: ({ value, onChange, id }) => (
    <input id={id} value={value} onChange={(e) => onChange(e.target.value)} />
  ),
};

function renderForm(config: FormPageConfig, fetcher = vi.fn().mockResolvedValue({})) {
  return render(
    <ShellsProvider components={components} fetcher={fetcher}>
      <FormPage {...config} />
    </ShellsProvider>
  );
}

const config: FormPageConfig = {
  title: "Review",
  endpoint: "/api/reviews",
  fields: [{ id: "name", type: "text", label: "Name", required: true }],
};

describe("renderControl missing() guard", () => {
  it("throws a descriptive error when the required component is absent", () => {
    expect(() =>
      renderControl(
        { Table: () => null },
        { id: "bio", type: "textarea", label: "Bio" },
        "",
        () => {}
      )
    ).toThrow('FormPage: field type "textarea" requires `Textarea`');
  });
});

describe("FormPage", () => {
  it("blocks submit and shows the error when a required field is empty", async () => {
    const fetcher = vi.fn().mockResolvedValue({});
    renderForm(config, fetcher);

    fireEvent.click(screen.getByText("Submit"));

    expect(await screen.findByText("Name is required")).toBeTruthy();
    expect(fetcher).not.toHaveBeenCalled();
  });

  it("submits visible fields and calls onSuccess with the response", async () => {
    const fetcher = vi.fn().mockResolvedValue({ id: 1 });
    const onSuccess = vi.fn();
    renderForm({ ...config, onSuccess }, fetcher);

    fireEvent.change(screen.getByLabelText(/Name/), {
      target: { value: "Ada" },
    });
    fireEvent.click(screen.getByText("Submit"));

    await waitFor(() => expect(onSuccess).toHaveBeenCalledWith({ id: 1 }));
    expect(fetcher).toHaveBeenCalledWith(
      "/api/reviews",
      expect.objectContaining({ method: "POST", body: JSON.stringify({ name: "Ada" }) })
    );
  });

  it("calls onError when the fetcher rejects", async () => {
    const failure = new Error("boom");
    const fetcher = vi.fn().mockRejectedValue(failure);
    const onError = vi.fn();
    renderForm({ ...config, onError }, fetcher);

    fireEvent.change(screen.getByLabelText(/Name/), {
      target: { value: "Ada" },
    });
    fireEvent.click(screen.getByText("Submit"));

    await waitFor(() => expect(onError).toHaveBeenCalledWith(failure));
  });
});
