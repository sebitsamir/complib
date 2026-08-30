"use client";

import { useAuth } from "@clerk/nextjs";
import PricingView from "./PricingView";

export default function PricingPageClerk() {
  const { isSignedIn } = useAuth();
  return <PricingView isSignedIn={!!isSignedIn} />;
}
