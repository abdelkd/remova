import PolicyLayout from '@/components/PrivacyLayout';
import { Separator } from '@/components/ui/separator';
import { RefreshCcw } from 'lucide-react';

const RefundPolicy = () => (
  <PolicyLayout
    icon={RefreshCcw}
    title="Refund Policy"
    lastUpdated="January 6, 2025"
  >
    <section>
      <h2 className="text-xl font-semibold mb-4">1. Refund Eligibility</h2>
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          We offer refunds under the following conditions:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>Request made within 30 days of purchase</li>
          <li>Service has not been substantially used</li>
          <li>Technical issues preventing service use</li>
          <li>Incorrect charges or billing errors</li>
        </ul>
      </div>
    </section>

    <Separator className="my-6" />

    <section>
      <h2 className="text-xl font-semibold mb-4">2. Refund Process</h2>
      <p className="text-muted-foreground leading-relaxed">
        To request a refund, please contact our support team with your order
        details. Refunds are typically processed within 5-7 business days and
        will be issued to the original payment method.
      </p>
    </section>

    <Separator className="my-6" />

    <section>
      <h2 className="text-xl font-semibold mb-4">3. Non-Refundable Items</h2>
      <p className="text-muted-foreground leading-relaxed">
        Certain items and services are non-refundable, including but not limited
        to custom orders, digital downloads after access, and subscription
        services after the trial period.
      </p>
    </section>
  </PolicyLayout>
);

export default RefundPolicy;
