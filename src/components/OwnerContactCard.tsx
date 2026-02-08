import { Phone, Mail, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OwnerContactCardProps {
  ownerName?: string;
  contactPhone?: string | null;
  contactEmail?: string | null;
}

const OwnerContactCard = ({ ownerName, contactPhone, contactEmail }: OwnerContactCardProps) => {
  const cleanPhone = contactPhone?.replace(/[^0-9+]/g, "") || "";

  return (
    <div className="bg-card border rounded-xl p-6">
      <h3 className="font-heading text-lg font-semibold mb-1">
        Contact {ownerName || "Owner"}
      </h3>
      <p className="text-sm text-muted-foreground mb-5">
        Reach out to the property owner directly
      </p>

      <div className="space-y-3">
        {/* Call */}
        {cleanPhone && (
          <Button asChild variant="default" className="w-full gap-2">
            <a href={`tel:${cleanPhone}`}>
              <Phone className="w-4 h-4" />
              Call Owner
            </a>
          </Button>
        )}

        {/* WhatsApp */}
        {cleanPhone && (
          <Button asChild variant="secondary" className="w-full gap-2">
            <a
              href={`https://wa.me/${cleanPhone.replace("+", "")}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </a>
          </Button>
        )}

        {/* Email */}
        {contactEmail && (
          <Button asChild variant="outline" className="w-full gap-2">
            <a href={`mailto:${contactEmail}`}>
              <Mail className="w-4 h-4" />
              Send Email
            </a>
          </Button>
        )}

        {!cleanPhone && !contactEmail && (
          <p className="text-sm text-muted-foreground text-center py-2">
            No contact details provided by the owner.
          </p>
        )}
      </div>

      {cleanPhone && (
        <p className="text-xs text-muted-foreground text-center mt-4">
          {cleanPhone}
        </p>
      )}
    </div>
  );
};

export default OwnerContactCard;
