import { InferenceClient } from '@huggingface/inference';
import pRetry from 'p-retry';
import { updateEmailCategory } from '../persistence/elastic/emailsRepository.js';
import { triggerNotifications } from "../integrations/notifications.js";


const LABELS = [
  'Interested',
  'Meeting Booked',
  'Not Interested',
  'Spam',
  'Out of Office'
];

class EmailClassifier {
  constructor() {
    this.client = new InferenceClient(process.env.HF_TOKEN);
    this.model = process.env.HF_MODEL || 'facebook/bart-large-mnli';
  }

  async classify(email) {
    const text = `Subject: ${email.subject}\n\n${email.body}`;

    const run = async () => {
      const res = await this.client.zeroShotClassification({
        model: this.model,
        inputs: text,
        parameters: { candidate_labels: LABELS, multi_label: false }
      });

      const label = res?.labels?.[0] || 'Uncategorized';
      await updateEmailCategory(email.id, label);
      return label;
    };

    if (label === "Interested") {
  await triggerNotifications(email);
}

    return await pRetry(run, {
      retries: 3,
      factor: 2,
      onFailedAttempt: (err) =>
        console.warn(`Retry classify attempt ${err.attemptNumber}: ${err.message}`),
    });
  }
}

export const classifier = new EmailClassifier();