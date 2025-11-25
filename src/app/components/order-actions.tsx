"use client";

import { useState } from "react";

async function call(endpoint: string, payload?: any) {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload ? JSON.stringify(payload) : undefined,
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || "Request failed");
  }
  return res.json();
}

export function OrderActions({ orderId, role }: { orderId: string; role: string }) {
  const [message, setMessage] = useState<string | null>(null);

  const handlePay = async () => {
    try {
      await call(`/api/orders/${orderId}/pay`);
      setMessage("Payment captured and escrow started.");
    } catch (err: any) {
      setMessage(err.message);
    }
  };

  const handleDeliver = async () => {
    try {
      const accessDetails = prompt("Enter access details to submit to AccFlipper staff");
      if (!accessDetails) return;
      await call(`/api/orders/${orderId}/deliver`, { accessDetails });
      setMessage("Credentials submitted to staff.");
    } catch (err: any) {
      setMessage(err.message);
    }
  };

  const handleDispute = async () => {
    try {
      const reason = prompt("Why are you opening a dispute?") || "Buyer opened dispute";
      await call(`/api/orders/${orderId}/dispute`, { reason });
      setMessage("Dispute opened; timer paused.");
    } catch (err: any) {
      setMessage(err.message);
    }
  };

  const handleRelease = async () => {
    try {
      await call(`/api/orders/${orderId}/release`);
      setMessage("Funds released to seller.");
    } catch (err: any) {
      setMessage(err.message);
    }
  };

  const handleForward = async () => {
    try {
      await call(`/api/orders/${orderId}/forward`);
      setMessage("Access forwarded to buyer.");
    } catch (err: any) {
      setMessage(err.message);
    }
  };

  return (
    <div className="space-y-2 text-sm">
      {role === "buyer" && (
        <div className="flex flex-wrap gap-2">
          <button className="btn" onClick={handlePay}>Pay & Start escrow</button>
          <button className="rounded-lg border border-slate-200 px-3 py-2" onClick={handleDispute}>Open dispute</button>
        </div>
      )}
      {role === "seller" && (
        <div className="flex flex-wrap gap-2">
          <button className="btn" onClick={handleDeliver}>Submit access to staff</button>
        </div>
      )}
      {role === "admin" && (
        <div className="flex flex-wrap gap-2">
          <button className="btn" onClick={handleForward}>Mark as sent to buyer</button>
          <button className="rounded-lg border border-slate-200 px-3 py-2" onClick={handleRelease}>Force release</button>
        </div>
      )}
      {message && <p className="text-brand-700">{message}</p>}
    </div>
  );
}
