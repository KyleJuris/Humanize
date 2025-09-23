"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function PricingFAQ() {
  const faqs = [
    {
      question: "Can I change my plan anytime?",
      answer:
        "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any billing differences.",
    },
    {
      question: "What happens if I exceed my word limit?",
      answer:
        "If you exceed your monthly word limit, you'll need to upgrade your plan or wait until the next billing cycle. We'll notify you when you're approaching your limit.",
    },
    {
      question: "Do you offer refunds?",
      answer:
        "We offer a 14-day money-back guarantee for all paid plans. If you're not satisfied, contact our support team for a full refund.",
    },
    {
      question: "Is there a free trial?",
      answer:
        "Yes, all paid plans come with a 14-day free trial. You can cancel anytime during the trial period without being charged.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards (Visa, MasterCard, American Express) and PayPal. Enterprise customers can also pay by invoice.",
    },
    {
      question: "Can I use HumanizePro for commercial purposes?",
      answer:
        "Yes, all our plans allow commercial use. However, please ensure you comply with your industry's guidelines and regulations.",
    },
    {
      question: "Do you offer enterprise plans?",
      answer:
        "Yes, we offer custom enterprise solutions with higher word limits, dedicated support, and additional features. Contact our sales team for more information.",
    },
  ]

  return (
    <Accordion type="single" collapsible className="space-y-4">
      {faqs.map((faq, index) => (
        <AccordionItem key={index} value={`item-${index}`} className="bg-background rounded-lg px-6 border">
          <AccordionTrigger className="text-left hover:no-underline">{faq.question}</AccordionTrigger>
          <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
