import { useState } from "react";
import { ShieldCheck, X } from "lucide-react";

export default function BookingModal() {
  const [showBookingNotice, setShowBookingNotice] = useState(true);

  return (
    <>
      {showBookingNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-5 backdrop-blur-[2px]">
          <div className="relative w-full max-w-125 overflow-hidden rounded-3xl bg-white shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
            <button
              type="button"
              onClick={() => setShowBookingNotice(false)}
              className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
              aria-label="Close"
            >
              <X size={19} />
            </button>

            <div className="px-7 pb-2 pt-8 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f0f5ed]">
                <ShieldCheck size={30} className="text-[#708464]" />
              </div>
            </div>

            <div className="px-8 pb-8 pt-4 text-center">
              <h2 className="font-serif text-[25px] font-medium text-[#2f2f2f]">
                Minimum booking duration
              </h2>

              <p className="mt-3 text-sm leading-6 text-gray-500">
                All PawBorrow rentals have a minimum booking duration of{" "}
                <strong className="font-semibold text-[#4d6044]">1 hour</strong>
                .
              </p>

              <div className="mt-6 rounded-2xl bg-[#f7faf5] p-5 text-left">
                <h3 className="text-sm font-semibold text-[#333]">
                  Why do we have a minimum?
                </h3>

                <p className="mt-2 text-[13px] leading-6 text-gray-500">
                  To help ensure the safety and well-being of our pets,
                  PawBorrow requires a minimum booking duration of 1 hour.
                </p>

                <p className="mt-2 text-[13px] leading-6 text-gray-500">
                  Our pets are cared for and managed by PawBorrow, and each
                  renter is responsible for the pet throughout their scheduled
                  booking. The minimum duration helps us properly prepare each
                  pet, coordinate their availability, and provide a safe and
                  comfortable rental experience.
                </p>

                <p className="mt-3 text-[13px] leading-6 text-gray-500">
                  A minimum booking duration helps provide a smoother and more
                  reliable experience for both pet hosts and renters.
                </p>
              </div>

              <div className="mt-4 flex gap-3 rounded-2xl border border-[#e2e8dc] bg-white p-4 text-left">
                <ShieldCheck
                  size={20}
                  className="mt-0.5 shrink-0 text-[#879b7b]"
                />

                <p className="text-xs leading-5 text-gray-500">
                  By continuing, you acknowledge that bookings require a minimum
                  duration of 1 hour.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowBookingNotice(false)}
                className="mt-6 h-12 w-full rounded-xl bg-[#879b7b] text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-[#748a68]"
              >
                I Understand
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
