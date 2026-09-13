import Navbar from "../components/ui/Navbar"
import {} from "@repo/api"
import { User, ArrowRight, Mail, KeyRound, Phone, Trash, CalendarClock, Megaphone, UsersRound,} from 'lucide-react';

export default function Profile() {
  return (
    <main>
      <Navbar />
      <div className="w-full p-6 ">
      <div className="mx-auto flex w-full max-w-[860px] flex-col gap-8 ">
        <div className="flex w-full justify-center ">
          <div className="group relative h-[120px] w-[120px] overflow-hidden">
            <img  src="/images/test-profile.jpg" className="h-[120px] w-[120px] rounded-md bg-red-600" />
          </div>
        </div>
        <div className="flex flex-col gap-2 ">
          <div className="flex flex-col gap-0.5 pb-1">
            <div className="text-base font-medium">General</div>
            <div className="text-xs">Manage your basic profile information</div>
          </div>
          <div className="flex w-full flex-col overflow-hidden rounded-lg border">
            <div className="flex w-full items-center justify-between gap-4 border-b border-sd-border px-6 py-5 last:border-none cursor-pointer hover:bg-sd-accent">
              <div className="flex flex-1 items-start gap-3">
                <div className="relative text-[16px] leading-[normal] p-0.5 before:block before:h-4 before:w-4 mt-0.5 text-sd-muted-foreground">
                  <User className="h-6 w-6 absolute -translate-x-1/2 -translate-y-1/2 align-[-0.125em] left-1/2 top-1/2" />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="text-base font-medium text-sd-foreground">Display Name</div>
                  <div className="text-xs text-sd-muted-foreground supports-[not(overflow-wrap:anywhere)]:[word-break:break-word] supports-[overflow-wrap:anywhere]:[overflow-wrap:anywhere]">John Doe</div>
                </div>
              </div>
              <div className="relative text-[16px] leading-[normal] p-0.5 before:block before:h-4 before:w-4 text-sd-muted-foreground">
                <ArrowRight className="h-6 w-6 absolute -translate-x-1/2 -translate-y-1/2 align-[-0.125em] left-1/2 top-1/2"/>
              </div>
            </div>
            <div className="flex w-full items-center justify-between gap-4 border-b border-sd-border px-6 py-5 last:border-none cursor-pointer hover:bg-sd-accent">
              <div className="flex flex-1 items-start gap-3">
                <div className="relative text-[16px] leading-[normal] p-0.5 before:block before:h-4 before:w-4 mt-0.5 text-sd-muted-foreground">
                  <User className="h-6 w-6 absolute -translate-x-1/2 -translate-y-1/2 align-[-0.125em] left-1/2 top-1/2" />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="text-base font-medium text-sd-foreground">Name</div>
                  <div className="text-xs text-sd-muted-foreground supports-[not(overflow-wrap:anywhere)]:[word-break:break-word] supports-[overflow-wrap:anywhere]:[overflow-wrap:anywhere]">John </div>
                </div>
              </div>
               <div className="relative text-[16px] leading-[normal] p-0.5 before:block before:h-4 before:w-4 text-sd-muted-foreground">
                <ArrowRight className="h-6 w-6 absolute -translate-x-1/2 -translate-y-1/2 align-[-0.125em] left-1/2 top-1/2"/>
              </div>
            </div>
            <div className="flex w-full items-center justify-between gap-4 border-b border-sd-border px-6 py-5 last:border-none cursor-pointer hover:bg-sd-accent">
              <div className="flex flex-1 items-start gap-3">
                <div className="relative text-[16px] leading-[normal] p-0.5 before:block before:h-4 before:w-4 mt-0.5 text-sd-muted-foreground">
                  <Mail className="h-6 w-6 absolute -translate-x-1/2 -translate-y-1/2 align-[-0.125em] left-1/2 top-1/2" />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="text-base font-medium text-sd-foreground">Email</div>
                  <div className="text-xs text-sd-muted-foreground supports-[not(overflow-wrap:anywhere)]:[word-break:break-word] supports-[overflow-wrap:anywhere]:[overflow-wrap:anywhere]">pawborrow@gmail.com</div>
                </div>
              </div>
               <div className="relative text-[16px] leading-[normal] p-0.5 before:block before:h-4 before:w-4 text-sd-muted-foreground">
                <ArrowRight className="h-6 w-6 absolute -translate-x-1/2 -translate-y-1/2 align-[-0.125em] left-1/2 top-1/2"/>
              </div>
            </div>
                 <div className="flex w-full items-center justify-between gap-4 border-b border-sd-border px-6 py-5 last:border-none cursor-pointer hover:bg-sd-accent">
              <div className="flex flex-1 items-start gap-3">
                <div className="relative text-[16px] leading-[normal] p-0.5 before:block before:h-4 before:w-4 mt-0.5 text-sd-muted-foreground">
                  <Phone className="h-6 w-6 absolute -translate-x-1/2 -translate-y-1/2 align-[-0.125em] left-1/2 top-1/2" />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="text-base font-medium text-sd-foreground">Phone</div>
                  <div className="text-xs text-sd-muted-foreground supports-[not(overflow-wrap:anywhere)]:[word-break:break-word] supports-[overflow-wrap:anywhere]:[overflow-wrap:anywhere]">+6309573458734</div>
                </div>
              </div>
               <div className="relative text-[16px] leading-[normal] p-0.5 before:block before:h-4 before:w-4 text-sd-muted-foreground">
                <ArrowRight className="h-6 w-6 absolute -translate-x-1/2 -translate-y-1/2 align-[-0.125em] left-1/2 top-1/2"/>
              </div>
            </div>
              <div className="flex w-full items-center justify-between gap-4 border-b border-sd-border px-6 py-5 last:border-none cursor-pointer hover:bg-sd-accent">
              <div className="flex flex-1 items-start gap-3">
                <div className="relative text-[16px] leading-[normal] p-0.5 before:block before:h-4 before:w-4 mt-0.5 text-sd-muted-foreground">
                  <KeyRound className="h-6 w-6 absolute -translate-x-1/2 -translate-y-1/2 align-[-0.125em] left-1/2 top-1/2" />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="text-base font-medium text-sd-foreground">Password</div>
                  <div className="text-xs text-sd-muted-foreground supports-[not(overflow-wrap:anywhere)]:[word-break:break-word] supports-[overflow-wrap:anywhere]:[overflow-wrap:anywhere]">Not set</div>
                </div>
              </div>
               <div className="relative text-[16px] leading-[normal] p-0.5 before:block before:h-4 before:w-4 text-sd-muted-foreground">
                <ArrowRight className="h-6 w-6 absolute -translate-x-1/2 -translate-y-1/2 align-[-0.125em] left-1/2 top-1/2"/>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
           <div className="flex flex-col gap-0.5 pb-1">
            <div className="text-base font-medium">Privacy Settings</div>
           </div>
           <div className="flex w-full flex-col overflow-hidden rounded-md border">
                <div className="flex w-full items-center justify-between gap-4 border-b border-sd-border px-6 py-5 last:border-none cursor-pointer hover:bg-sd-accent">
              <div className="flex flex-1 items-start gap-3">
                <div className="relative text-[16px] leading-[normal] p-0.5 before:block before:h-4 before:w-4 mt-0.5 text-sd-muted-foreground">
                  <Trash className="h-6 w-6 text-red-600 absolute -translate-x-1/2 -translate-y-1/2 align-[-0.125em] left-1/2 top-1/2" />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="text-base font-medium text-sd-foreground text-red-600">Delete Account</div>
                </div>
              </div>
              <div className="relative text-[16px] leading-[normal] p-0.5 before:block before:h-4 before:w-4 text-sd-muted-foreground">
                <ArrowRight className="h-6 w-6 absolute -translate-x-1/2 -translate-y-1/2 align-[-0.125em] left-1/2 top-1/2"/>
              </div>
            </div>
           </div>
        </div>

        <div className="flex flex-col gap-2">
           <div className="flex flex-col gap-0.5 pb-1">
            <div className="text-base font-medium">Notification Settings</div>
            <div className="text-xs">Important account notifications and reminders cannot be turned off</div>
           </div>
           <div className="flex w-full flex-col overflow-hidden rounded-md border">
              <div className="flex w-full items-center justify-between gap-4 border-b border-sd-border px-6 py-5 last:border-none cursor-pointer hover:bg-sd-accent">
              <div className="flex flex-1 items-start gap-3">
                <div className="relative text-[16px] leading-[normal] p-0.5 before:block before:h-4 before:w-4 mt-0.5 text-sd-muted-foreground">
                  <CalendarClock className="h-6 w-6 absolute -translate-x-1/2 -translate-y-1/2 align-[-0.125em] left-1/2 top-1/2" />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="text-base font-medium text-sd-foreground">Booking Updates</div>
                </div>
              </div>
              <div className="relative text-[16px] leading-[normal] p-0.5 before:block before:h-4 before:w-4 text-sd-muted-foreground">
                <ArrowRight className="h-6 w-6 absolute -translate-x-1/2 -translate-y-1/2 align-[-0.125em] left-1/2 top-1/2"/>
              </div>
             </div>
              <div className="flex w-full items-center justify-between gap-4 border-b border-sd-border px-6 py-5 last:border-none cursor-pointer hover:bg-sd-accent">
              <div className="flex flex-1 items-start gap-3">
                <div className="relative text-[16px] leading-[normal] p-0.5 before:block before:h-4 before:w-4 mt-0.5 text-sd-muted-foreground">
                  <Megaphone className="h-6 w-6 absolute -translate-x-1/2 -translate-y-1/2 align-[-0.125em] left-1/2 top-1/2" />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="text-base font-medium text-sd-foreground">Promotions</div>
                </div>
              </div>
              <div className="relative text-[16px] leading-[normal] p-0.5 before:block before:h-4 before:w-4 text-sd-muted-foreground">
                <ArrowRight className="h-6 w-6 absolute -translate-x-1/2 -translate-y-1/2 align-[-0.125em] left-1/2 top-1/2"/>
              </div>
             </div>
              <div className="flex w-full items-center justify-between gap-4 border-b border-sd-border px-6 py-5 last:border-none cursor-pointer hover:bg-sd-accent">
              <div className="flex flex-1 items-start gap-3">
                <div className="relative text-[16px] leading-[normal] p-0.5 before:block before:h-4 before:w-4 mt-0.5 text-sd-muted-foreground">
                  <UsersRound className="h-6 w-6 absolute -translate-x-1/2 -translate-y-1/2 align-[-0.125em] left-1/2 top-1/2" />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="text-base font-medium text-sd-foreground">Customer Surveys</div>
                </div>
              </div>
              <div className="relative text-[16px] leading-[normal] p-0.5 before:block before:h-4 before:w-4 text-sd-muted-foreground">
                <ArrowRight className="h-6 w-6 absolute -translate-x-1/2 -translate-y-1/2 align-[-0.125em] left-1/2 top-1/2"/>
              </div>
             </div>
           </div>
           
        </div>
      </div>
    </div>
    </main>
   
  )
}