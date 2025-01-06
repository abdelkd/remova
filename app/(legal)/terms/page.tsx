import PolicyLayout from '@/components/PrivacyLayout';
import { Separator } from '@/components/ui/separator';
import { Scale } from 'lucide-react';

export const TermsOfService = () => (
  <PolicyLayout
    icon={Scale}
    title="Terms of Service"
    lastUpdated="January 6, 2025"
  >
    <section>
      <h2 className="text-xl font-semibold mb-4">1. What We Offer</h2>
      <p className="text-muted-foreground leading-relaxed">
        We provide a service that generates content (e.g., text, images, etc.)
        for a fee of $2 for 100 generations (&quot;Service&quot;). The Service
        is provided &quot;as is&quot; and &quot;as available.&quot; We do not
        guarantee that the Service will always work perfectly or meet your
        specific needs.
      </p>
    </section>

    <Separator className="my-6" />

    <section>
      <h2 className="text-xl font-semibold mb-4">2. Your Responsibilities</h2>
      <div className="space-y-4">
        {/* <p className="text-muted-foreground leading-relaxed"> */}
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>You must be at least 13 years old to use this Website.</li>
          <li>
            You agree to use the Service only for lawful purposes and not to
            misuse it (e.g., spamming, hacking, or violating any laws).
          </li>
          <li>
            You are responsible for keeping your account information (if
            applicable) secure and confidential.
          </li>
        </ul>
      </div>
    </section>

    <Separator className="my-6" />

    <section>
      <h2 className="text-xl font-semibold mb-4">3. Intellectual Property</h2>
      <p className="text-muted-foreground leading-relaxed">
        All content, features, and functionality of our services are owned by us
        and protected by international copyright, trademark, and other
        intellectual property laws.
      </p>
    </section>
  </PolicyLayout>
);

export default TermsOfService;
