"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { NetworkAnimation } from "@/components/network-animation";
import { SubmitSuccessConfetti } from "@/components/submit-success-confetti";
import Web3 from "web3";

// Schema for form validation
const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters."),
  doi: z.string().min(5, "DOI or link must be at least 5 characters."),
  repository: z.string().optional(),
  abstract: z.string().min(20, "Abstract must be at least 20 characters."),
});

// Replace with your actual contract details
const CONTRACT_ADDRESS = "0xc3c76fD097FBEa31B213660543f8E6166538Bb42"; // 🛑 Replace with real contract address
const CONTRACT_ABI = [
  {
    constant: false,
    inputs: [
      { name: "to", type: "address" },
      { name: "title", type: "string" },
      { name: "doi", type: "string" },
      { name: "repository", type: "string" },
      { name: "extra", type: "uint256" },
    ],
    name: "mintSBT",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export default function SubmitPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // React Hook Form setup
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      doi: "",
      repository: "",
      abstract: "",
    },
  });

  async function mintSBT(title: string, doi: string, repository: string) {
    try {
      if (!window.ethereum) {
        throw new Error("MetaMask is not installed.");
      }

      const web3 = new Web3(window.ethereum);
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const accounts = await web3.eth.getAccounts();
      const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

      // Call the mintSBT function on the smart contract
      const tx = await contract.methods
        .mintSBT(accounts[0], title, doi, repository || "", 0)
        .send({ from: accounts[0] });

      return tx.transactionHash;
    } catch (error) {
      console.error("Minting SBT failed:", error);
      throw error;
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!window.ethereum) {
      toast({
        title: "MetaMask Required",
        description: "Please install and connect MetaMask to submit.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("Submitting values:", values);

      const transactionHash = await mintSBT(values.title, values.doi, values.repository || "");
      console.log("Transaction Hash:", transactionHash);
      setShowSuccess(true);

      setTimeout(() => {
        toast({
          title: "SBT Minted Successfully!",
          description: `Transaction Hash: ${transactionHash}`,
        });

        form.reset();
        setShowSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Transaction Failed:", error);
      toast({
        title: "Submission Failed",
        description: "Transaction could not be processed. Try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="container py-10 relative">
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <NetworkAnimation />
      </div>

      <AnimatePresence>{showSuccess && <SubmitSuccessConfetti />}</AnimatePresence>

      <div className="mx-auto max-w-2xl relative z-10">
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h1
            className="text-3xl font-bold tracking-tight"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Submit New Contribution
          </motion.h1>

          <Card className="border-primary/20 shadow-lg shadow-primary/5">
            <CardHeader>
              <CardTitle>Contribution Details</CardTitle>
              <CardDescription>
                Provide details about your research work.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Research Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="doi"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>DOI / Research Link</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter DOI or link" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="repository"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>GitHub / Repository (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter repository link" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="abstract"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Abstract / Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Brief description" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Contribution"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
