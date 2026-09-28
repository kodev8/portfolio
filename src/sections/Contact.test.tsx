import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import emailjs from "@emailjs/browser";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Contact from "./Contact";
import { LanguageProvider } from "../context/LanguageContext";
import { MediaProvider } from "../context/MediaContext";
import { NavProvider } from "../context/NavContext";
import { contactForm } from "../constants";

const toast = vi.hoisted(() => ({ success: vi.fn(), error: vi.fn() }));
vi.mock("sonner", () => ({ toast, Toaster: () => null }));

const sendForm = vi.mocked(emailjs.sendForm);

const renderContact = () => {
  const user = userEvent.setup();
  const view = render(
    <LanguageProvider>
      <MediaProvider>
        <NavProvider>
          <Contact />
        </NavProvider>
      </MediaProvider>
    </LanguageProvider>
  );
  return { user, ...view };
};

const fillForm = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.type(screen.getByRole("textbox", { name: /name/i }), "Ada");
  await user.type(screen.getByRole("textbox", { name: /email/i }), "ada@example.com");
  await user.type(screen.getByRole("textbox", { name: /message/i }), "Hello");
};

beforeEach(() => {
  sendForm.mockReset();
  sendForm.mockResolvedValue({ status: 200, text: "OK" });
});

describe("Contact", () => {
  it("renders the three fields", () => {
    renderContact();
    expect(screen.getByRole("textbox", { name: /name/i })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /email/i })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /message/i })).toBeInTheDocument();
  });

  it("marks every field required", () => {
    renderContact();
    for (const name of [/name/i, /email/i, /message/i]) {
      expect(screen.getByRole("textbox", { name })).toBeRequired();
    }
  });

  it("sends the form through emailjs on submit", async () => {
    const { user } = renderContact();
    await fillForm(user);

    await user.click(screen.getByRole("button", { name: /send/i }));

    await waitFor(() => expect(sendForm).toHaveBeenCalledTimes(1));
  });

  it("toasts on a successful send", async () => {
    const { user } = renderContact();
    await fillForm(user);

    await user.click(screen.getByRole("button", { name: /send/i }));

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(contactForm.success.en)
    );
    expect(toast.error).not.toHaveBeenCalled();
  });

  it("clears the fields after a successful send", async () => {
    const { user } = renderContact();
    await fillForm(user);

    await user.click(screen.getByRole("button", { name: /send/i }));

    await waitFor(() =>
      expect(screen.getByRole("textbox", { name: /name/i })).toHaveValue("")
    );
    expect(screen.getByRole("textbox", { name: /message/i })).toHaveValue("");
  });

  it("toasts an error when the send is rejected", async () => {
    sendForm.mockRejectedValue(new Error("network down"));
    const { user } = renderContact();
    await fillForm(user);

    await user.click(screen.getByRole("button", { name: /send/i }));

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith(contactForm.error.en));
    expect(toast.success).not.toHaveBeenCalled();
  });

  it("keeps what the user typed when the send fails", async () => {
    sendForm.mockRejectedValue(new Error("network down"));
    const { user } = renderContact();
    await fillForm(user);

    await user.click(screen.getByRole("button", { name: /send/i }));

    await waitFor(() => expect(toast.error).toHaveBeenCalled());
    expect(screen.getByRole("textbox", { name: /name/i })).toHaveValue("Ada");
  });

  it("re-enables the button once the request settles", async () => {
    const { user } = renderContact();
    await fillForm(user);
    const button = screen.getByRole("button", { name: /send/i });

    await user.click(button);

    await waitFor(() => expect(button).toBeEnabled());
  });

  it("never sends without a submit", () => {
    renderContact();
    expect(sendForm).not.toHaveBeenCalled();
  });
});
