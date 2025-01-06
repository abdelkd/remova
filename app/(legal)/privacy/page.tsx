import PolicyLayout from '@/components/PrivacyLayout';
import { Separator } from '@/components/ui/separator';
import { Shield } from 'lucide-react';

const PrivacyPolicy = () => (
  <PolicyLayout
    icon={Shield}
    title="Privacy Policy"
    lastUpdated="January 6, 2025"
  >
    <section>
      <h2 className="text-xl font-semibold mb-4">1. Information We Collect</h2>
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          We collect information that you provide directly to us when using our
          services. This may include:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>Personal identification information</li>
          <li>Contact information</li>
          <li>Payment details</li>
          <li>Usage data and preferences</li>
        </ul>
      </div>
    </section>

    <Separator className="my-6" />

    <section>
      <h2 className="text-xl font-semibold mb-4">
        2. How We Use Your Information
      </h2>
      <p className="text-muted-foreground leading-relaxed">
        We use the collected information to provide, maintain, and improve our
        services, as well as to communicate with you about updates, security
        alerts, and support messages.
      </p>
    </section>

    <Separator className="my-6" />

    <section>
      <h2 className="text-xl font-semibold mb-4">3. Data Protection</h2>
      <p className="text-muted-foreground leading-relaxed">
        We implement appropriate technical and organizational measures to
        maintain the security of your personal information and protect it
        against unauthorized or unlawful processing.
      </p>
    </section>
  </PolicyLayout>
);

export default PrivacyPolicy;
