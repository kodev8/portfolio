import { useRef, useState, useEffect } from "react";
import emailjs from "@emailjs/browser";
import { useNav } from "../context/NavContext";
import TitleHeader from "../components/TitleHeader";
import ContactRoutes from "../components/ContactRoutes";
import { toast } from "sonner";
import { Spinner } from "../components/ui/spinner";
import { Button } from "../components/ui/button";
import { contactHeader, contactForm } from "../constants";
import { useLanguage } from "../context/LanguageContext";

const Contact = () => {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [loading, setLoading] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);
  const { registerSection } = useNav();
  const { language } = useLanguage();


  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = async (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  useEffect(() => {
    registerSection("contact", sectionRef);
  }, [registerSection]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      await emailjs.sendForm(
        import.meta.env.VITE_EMAIL_SERVICE_ID,
        import.meta.env.VITE_EMAIL_TEMPLATE_ID,
        formRef.current!,
        import.meta.env.VITE_EMAIL_PUBLIC_KEY
      );

      // testing so simutlate delay
      // await new Promise(resolve => setTimeout(resolve, 1000));
      setForm({ name: "", email: "", message: "" });
      toast.success(contactForm.success[language]);
    } catch {
      // console.log(error);
      toast.error(contactForm.error[language]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" ref={sectionRef} className="flex-center section-padding main-section">
      <div className="w-full h-full md:px-10 sm:px-4">
        <TitleHeader
          index="05"
          title={contactHeader.title[language]}
          sub={contactHeader.sub[language]}
        />
        <div className="grid-12-cols mt-16">
          <div className="xl:col-span-6">
            <div className="flex-center card-border rounded-xl p-10">
              <form
                ref={formRef}
                onSubmit={handleSubmit}
                className="w-full flex flex-col gap-7"
              >
                <div>
                  <label htmlFor="name">{contactForm.name.label[language]}</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder={contactForm.name.placeholder[language]}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email">{contactForm.email.label[language]}</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder={contactForm.email.placeholder[language]}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="message">{contactForm.message.label[language]}</label>
                  <textarea
                    id="message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder={contactForm.message.placeholder[language]}
                    rows={5}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="h-12 w-fit self-start rounded-xl bg-room-accent px-6 text-base font-semibold text-room-on-accent
                             transition-[filter,transform] duration-[var(--dur-fast)] ease-[var(--ease-out)]
                             hover:brightness-110 disabled:opacity-60"
                >
                  {loading ? (
                    <Spinner className="text-room-on-accent" />
                  ) : (
                    contactForm.submit.label[language]
                  )}
                </Button>
              </form>
            </div>
          </div>
          <div className="xl:col-span-6 flex items-center">
            <ContactRoutes />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
