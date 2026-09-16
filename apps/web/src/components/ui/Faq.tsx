import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const FAQ_DATA = {
  "General Overview": [
    {
      question: "What is PawBorrow?",
      answer:
        "PawBorrow is a platform that lets you spend time with pets without the long-term commitment of ownership. We manage and care for our own collection of animals, and you can book scheduled companionship sessions through our website.",
    },
    {
      question: "How is this different from adopting or fostering a pet?",
      answer:
        "Adoption and fostering involve taking a pet home, often indefinitely. PawBorrow sessions are scheduled visits you spend time with the animal at a set time and place, then the pet returns to our care. There's no ongoing responsibility for feeding, vet visits, or daily care.",
    },
    {
      question: "Where does PawBorrow operate?",
      answer:
        "PawBorrow currently operates in Quezon City, Philippines.",
    },
    {
      question: "How do I book a companionship session?",
      answer:
        "Browse available pets on the platform, check their profiles, and reserve a session for a time that works for you all managed through your account online.",
    },
    {
      question: "Can I choose which pet I spend time with?",
      answer:
        "Yes. Each pet has a profile you can view before booking, so you can pick based on breed, temperament, or availability.",
    },
    {
      question: "Can I cancel or reschedule a booking?",
      answer:
        "Yes, you can cancel or reschedule a booking through your account. Please check our cancellation policy for any fees or restrictions.",
    },
    {
      question: "What safety measures are in place during a session?",
      answer:
        "Sessions are scheduled and supervised to ensure both the pet's and the customer's safety, with scheduling designed to avoid overbooking or animal exhaustion.",
    },
    {
      question: "What if I have a problem during my session?",
      answer:
        "If you encounter any issues during your session, please contact our support team immediately through the app or website. We are here to help ensure a safe and enjoyable experience.",
    }
  ],
  Others: [
    {
      question: "How do I create an account?",
      answer:
        "Sign up through the website with your basic details to start browsing pets and booking sessions.",
    },
    {
      question: "How do I contact support?",
      answer:
        "You can reach our support team anytime through the Help section in the app or by emailing pawborrow@com or through our instagram.",
    },
  ],
};

type TabName = keyof typeof FAQ_DATA;

export default function FAQS() {
  const tabs = Object.keys(FAQ_DATA) as TabName[];
  const [activeTab, setActiveTab] = useState<TabName>(tabs[0]);

  return (
    <main className="relative">
      <div className="h-fit m-auto py-12 px-5 md:px-10 flex flex-col items-center relative become-a-host-faqs pb-32">
        <h1 className="text-3xl xs:text-4xl lg:text-5xl text-froly-400 tracking-tighter font-bold text-center mb-2">
          Frequently Asked Questions
        </h1>

        <div className="w-full max-w-200 mt-6">
          <div className="flex flex-row w-full justify-evenly text-froly-300">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full border-solid flex font-inter items-center justify-center py-3 font-bold text-xs sm:text-base md:text-lg cursor-pointer border-b-[3px] transition-colors ${
                  activeTab === tab
                    ? "border-background text-background"
                    : "border-[#94949480] text-[#696969]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div>
            <Accordion.Root
              type="single"
              collapsible
              key={activeTab}
              className="w-full font-inter text-background font-normal! mt-5 flex flex-col gap-4 text-sm min-h-75"
            >
              {FAQ_DATA[activeTab].map((item, index) => (
                <Accordion.Item
                  key={item.question}
                  value={`item-${index}`}
                  data-orientation="vertical"
                  className="border-none bg-[#F0F0F0] px-4 rounded-sm overflow-hidden"
                >
                  <Accordion.Header data-orientation="vertical" className="flex">
                    <Accordion.Trigger
                      className="flex flex-1 items-center justify-between py-3 font-medium text-left transition-all [&[data-state=open]>svg]:rotate-180"
                    >
                      {item.question}
                      <ChevronDown
                        size={18}
                        className="shrink-0 transition-transform duration-200"
                      />
                    </Accordion.Trigger>
                  </Accordion.Header>
                  <Accordion.Content
                    data-orientation="vertical"
                    className="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
                  >
                    <p className="pb-4 text-[#696969] font-normal">
                      {item.answer}
                    </p>
                  </Accordion.Content>
                </Accordion.Item>
              ))}
            </Accordion.Root>
          </div>
        </div>
      </div>
    </main>
  );
}

