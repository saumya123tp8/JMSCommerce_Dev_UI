import { Mail, MapPin, Phone, Clock, Send } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Textarea } from "@/components/ui/textarea";

import { Separator } from "@/components/ui/separator";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { contactSchema } from "@/schema/ContactSchema";

import type { ContactFormData } from "@/types/contact";

import toast from "react-hot-toast";

import Layout from "@/components/layout/Layout";

import ContactInfoCard from "@/components/contact/ContactInfoCard";

const Contact = () => {
  const {
    register,

    handleSubmit,

    formState: { errors, isSubmitting },

    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),

    mode: "onTouched",
  });

  const onSubmit = async (data: ContactFormData) => {
    console.log(data);

    toast.success("Message sent successfully.");

    reset();
  };
  return (
    <Layout title="Contact Us">
      <section className="bg-[#2E1F14]">
        <div className="container mx-auto grid items-center gap-12 px-6 py-20 lg:grid-cols-2">
          <div>
            <p className="mb-4 uppercase tracking-[0.35em] text-[#C9A96E]">
              GET IN TOUCH
            </p>

            <h1 className="font-serif text-5xl text-white">
              Let's Brew Something Together
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-8 text-[#D7C9BC]">
              Questions? Feedback? Business inquiry? Our team is always happy to
              help.
            </p>
          </div>

          <img
            src="/images/contact.jpg"
            alt="Coffee"
            className="rounded-2xl object-cover shadow-2xl"
          />
        </div>
      </section>
      <Card>
        <CardContent>
          <form>
            <div>
              <label className="mb-2 block text-sm font-medium">
                Full Name
              </label>

              <Input placeholder="John Doe" {...register("name")} />

              {errors.name && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Email</label>

              <Input
                type="email"
                placeholder="john@example.com"
                {...register("email")}
              />

              {errors.email && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Subject</label>

              <Input placeholder="Order enquiry" {...register("subject")} />

              {errors.subject && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.subject.message}
                </p>
              )}
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Message</label>

              <Textarea
                rows={6}
                placeholder="Write your message..."
                {...register("message")}
              />

              {errors.message && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.message.message}
                </p>
              )}
            </div>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#2E1F14] hover:bg-[#20150E]"
            >
              <Send className="mr-2 h-4 w-4" />

              {isSubmitting ? "Sending..." : "Send Message"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card className="border-none shadow-xl">
          <CardContent className="space-y-6 p-8">
            <h2 className="font-serif text-3xl text-[#2E1F14]">
              Visit Our Café
            </h2>

            <p className="text-muted-foreground">
              Drop in for freshly brewed coffee, delicious pastries, and warm
              conversations.
            </p>

            <Separator />

            <ContactInfoCard
              icon={<MapPin size={22} />}
              title="Address"
              value="12 Connaught Place, New Delhi 110001"
            />

            <ContactInfoCard
              icon={<Phone size={22} />}
              title="Phone"
              value="+91 98765 43210"
            />

            <ContactInfoCard
              icon={<Mail size={22} />}
              title="Email"
              value="hello@ambanicoffee.com"
            />

            <ContactInfoCard
              icon={<Clock size={22} />}
              title="Opening Hours"
              value="Monday - Sunday • 7:00 AM - 10:00 PM"
            />
          </CardContent>
        </Card>
        <Card className="border-none shadow-xl">
          <CardContent className="p-8">
            <h3 className="font-serif text-2xl text-[#2E1F14]">Follow Us</h3>

            <p className="mt-2 text-muted-foreground">
              Stay updated with our latest brews and events.
            </p>

            <div className="mt-6 flex gap-4">
              <Button variant="outline">Instagram</Button>

              <Button variant="outline">Facebook</Button>

              <Button variant="outline">Twitter</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* </div> */}

      {/* </section> */}
      <section className="pb-20">
        <div className="container mx-auto px-6">
          <Card className="overflow-hidden rounded-2xl border-none shadow-xl">
            <iframe
              title="Google Maps"
              src="https://www.google.com/maps?q=Connaught+Place+Delhi&output=embed"
              width="100%"
              height="450"
              loading="lazy"
              className="border-0"
            />
          </Card>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
