import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useCreateInquiry } from "@/hooks/useListings";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Send, Loader2 } from "lucide-react";
import { z } from "zod";

const inquirySchema = z.object({
  sender_name: z.string().trim().min(1, "Name is required").max(100),
  sender_email: z.string().trim().email("Invalid email").max(255),
  sender_phone: z.string().trim().max(20).optional(),
  message: z.string().trim().min(1, "Message is required").max(1000),
});

interface ContactFormProps {
  listingId: string;
  ownerName?: string;
}

const ContactForm = ({ listingId, ownerName }: ContactFormProps) => {
  const { user } = useAuth();
  const createInquiry = useCreateInquiry();
  const [form, setForm] = useState({
    sender_name: user?.user_metadata?.full_name || "",
    sender_email: user?.email || "",
    sender_phone: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = inquirySchema.safeParse(form);
    if (!result.success) {
      toast.error(result.error.errors[0].message);
      return;
    }

    try {
      await createInquiry.mutateAsync({
        listing_id: listingId,
        sender_name: result.data.sender_name,
        sender_email: result.data.sender_email,
        sender_phone: result.data.sender_phone || undefined,
        message: result.data.message,
        sender_id: user?.id,
      });
      toast.success("Inquiry sent! The owner will get back to you.");
      setForm((prev) => ({ ...prev, message: "" }));
    } catch {
      toast.error("Failed to send inquiry. Please try again.");
    }
  };

  return (
    <div className="bg-card border rounded-xl p-6">
      <h3 className="font-heading text-lg font-semibold mb-1">
        Contact {ownerName || "Owner"}
      </h3>
      <p className="text-sm text-muted-foreground mb-4">
        Send a message about this property
      </p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          placeholder="Your name"
          value={form.sender_name}
          onChange={(e) => setForm({ ...form, sender_name: e.target.value })}
          required
        />
        <Input
          type="email"
          placeholder="Your email"
          value={form.sender_email}
          onChange={(e) => setForm({ ...form, sender_email: e.target.value })}
          required
        />
        <Input
          type="tel"
          placeholder="Phone (optional)"
          value={form.sender_phone}
          onChange={(e) => setForm({ ...form, sender_phone: e.target.value })}
        />
        <Textarea
          placeholder="I'm interested in this property..."
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          rows={4}
          required
        />
        <Button type="submit" className="w-full gap-2" disabled={createInquiry.isPending}>
          {createInquiry.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
          Send Message
        </Button>
      </form>
    </div>
  );
};

export default ContactForm;
