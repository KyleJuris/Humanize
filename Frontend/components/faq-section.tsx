import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function FAQSection() {
  const faqs = [
    {
      question: "How does HumanizePro work?",
      answer:
        "HumanizePro uses advanced AI algorithms to analyze your text and rewrite it with natural human writing patterns, making it undetectable by AI detection tools.",
    },
    {
      question: "Is the humanized text plagiarism-free?",
      answer:
        "Yes, all output is original and plagiarism-free. We transform the structure and style while preserving the original meaning and intent.",
    },
    {
      question: "What languages are supported?",
      answer:
        "Currently, we support English with plans to add more languages soon. Our AI is trained on diverse English content for optimal results.",
    },
    {
      question: "Can I use this for academic work?",
      answer:
        "HumanizePro is designed for legitimate content improvement and should not be used for academic dishonesty. Please follow your institution's guidelines.",
    },
    {
      question: "How accurate is the AI detection bypass?",
      answer:
        "Our success rate is over 99% with major AI detectors. However, detection technology evolves, so we continuously update our algorithms.",
    },
  ]

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-muted-foreground">Everything you need to know about HumanizePro</p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="bg-background rounded-lg px-6">
                <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
