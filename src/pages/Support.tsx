import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { MessageCircle, BookOpen, Mail, CheckCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Form validation schema
const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name is too long"),
  email: z.string().email("Invalid email address").max(255, "Email is too long"),
  subject: z.string().min(5, "Subject must be at least 5 characters").max(200, "Subject is too long"),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000, "Message is too long"),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

const faqItems = [
  {
    id: "1",
    question: "What is DataVision?",
    answer: "DataVision is a comprehensive business intelligence platform designed to help growth teams track mandates, manage pipelines, monitor competitors, and organize projects and deliverables in one centralized location.",
  },
  {
    id: "2",
    question: "How do I create a new mandate?",
    answer: "Navigate to the Mandates section from the sidebar, click on 'Create Mandate', fill in the required details (company name, mandate type, status, etc.), and click 'Create Mandate'. The mandate will appear in your dashboard for tracking.",
  },
  {
    id: "3",
    question: "Can I track multiple companies at once?",
    answer: "Yes! DataVision is designed for tracking multiple companies across different stages. Use the Watchlist for monitoring competitors, the Pipeline/CRM for deal tracking, and create mandates for each company you're working with.",
  },
  {
    id: "4",
    question: "How do I add notes to a company?",
    answer: "Open the Pipeline/CRM dashboard, select a company, and click the 'Add Note' button in the Notes tab. You can log observations, meeting notes, or any relevant information about the company.",
  },
  {
    id: "5",
    question: "What are action items and how do I use them?",
    answer: "Action items are tasks assigned to team members for specific companies. In the Pipeline/CRM, click 'Add Action Item' to create a task with a due date and assignee. Mark them complete when done.",
  },
  {
    id: "6",
    question: "How can I organize my projects?",
    answer: "The Projects section allows you to create folder structures for organizing documents. You can upload files, track progress, and manage deliverables associated with each project.",
  },
  {
    id: "7",
    question: "What deliverable templates are available?",
    answer: "DataVision provides 6 standard templates: Investment Memo, Teaser Profile, Executive Summary, Financial Model, Due Diligence Report, and Term Sheet. You can create new deliverables from these templates.",
  },
  {
    id: "8",
    question: "Can I export my data?",
    answer: "Yes, you can export data from most sections of DataVision. Look for the export option in table headers or use your browser's built-in save functionality.",
  },
];

const documentationLinks = [
  {
    title: "Getting Started",
    description: "Learn the basics of using GrowthPal",
    url: "#",
    icon: "📘",
  },
  {
    title: "User Guide",
    description: "Comprehensive guide to all features and modules",
    url: "#",
    icon: "📖",
  },
  {
    title: "API Documentation",
    description: "Integration and API reference for developers",
    url: "#",
    icon: "⚙️",
  },
  {
    title: "Best Practices",
    description: "Tips and strategies for effective deal tracking",
    url: "#",
    icon: "💡",
  },
  {
    title: "Keyboard Shortcuts",
    description: "Speed up your workflow with shortcuts",
    url: "#",
    icon: "⌨️",
  },
  {
    title: "Troubleshooting",
    description: "Common issues and how to resolve them",
    url: "#",
    icon: "🔧",
  },
];

export default function Support() {
  const [submitted, setSubmitted] = useState(false);
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = (data: ContactFormData) => {
    console.log("Form submitted:", data);
    setSubmitted(true);
    form.reset();
    toast({
      title: "Message Sent",
      description: "We've received your message and will get back to you soon!",
    });
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Support & Help</h1>
          <p className="text-muted-foreground">Find answers, contact us, and explore our documentation</p>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="border-l-4 border-l-primary">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <MessageCircle className="h-6 w-6 text-primary shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Live Chat</h3>
                  <p className="text-sm text-muted-foreground">Chat with our support team in real-time</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-primary">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <Mail className="h-6 w-6 text-primary shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Email Support</h3>
                  <p className="text-sm text-muted-foreground">support@growthpal.io</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-primary">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <BookOpen className="h-6 w-6 text-primary shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Response Time</h3>
                  <p className="text-sm text-muted-foreground">Usually within 24 hours</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* FAQ Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>Find quick answers to common questions</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {faqItems.map((item) => (
                    <AccordionItem key={item.id} value={item.id}>
                      <AccordionTrigger className="text-left hover:no-underline">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form Section */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Contact Us</CardTitle>
                <CardDescription>Send us a message</CardDescription>
              </CardHeader>
              <CardContent>
                {submitted ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-primary mx-auto mb-4" />
                    <p className="font-semibold mb-2">Thank you!</p>
                    <p className="text-sm text-muted-foreground">We'll be in touch soon.</p>
                  </div>
                ) : (
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Your name" {...field} />
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="you@company.com" {...field} />
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">Subject</FormLabel>
                            <FormControl>
                              <Input placeholder="How can we help?" {...field} />
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">Message</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Describe your issue..." className="resize-none" {...field} />
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />

                      <Button type="submit" className="w-full">
                        Send Message
                      </Button>
                    </form>
                  </Form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Documentation Links */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold tracking-tight mb-4">Documentation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {documentationLinks.map((link) => (
              <a
                key={link.title}
                href={link.url}
                className="group block p-4 rounded-lg border border-border hover:border-primary hover:bg-accent transition-colors"
              >
                <div className="text-2xl mb-2">{link.icon}</div>
                <h3 className="font-semibold group-hover:text-primary transition-colors">{link.title}</h3>
                <p className="text-sm text-muted-foreground">{link.description}</p>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
