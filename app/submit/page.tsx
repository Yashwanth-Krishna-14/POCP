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
import { Loader2, CheckCircle } from "lucide-react";
import Web3 from "web3";
import { motion, AnimatePresence } from "framer-motion";

// OpenAlex API Base URL
const OPENALEX_API_BASE = "https://api.openalex.org/works/";
const submittedDOIs = new Set<string>();

const formSchema = z.object({
  doi: z.string().min(5, "DOI must be at least 5 characters."),
  title: z.string().min(5, "Title must be at least 5 characters."),
  repository: z.string().optional(),
  abstract: z.string().min(20, "Abstract must be at least 20 characters."),
});

// Smart Contract Details (Replace with Actual)
const CONTRACT_ADDRESS = "0xc3c76fD097FBEa31B213660543f8E6166538Bb42";
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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [apiTitle, setApiTitle] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "", doi: "", repository: "", abstract: "" },
  });

  async function checkPaperValidity(doi: string, providedTitle: string) {
    try {
      if (submittedDOIs.has(doi)) {
        setErrorMessage("This DOI has already been submitted!");
        return false;
      }

      const response = await fetch(`${OPENALEX_API_BASE}https://doi.org/${doi}`);
      if (!response.ok) throw new Error("DOI not found in OpenAlex.");

      const data = await response.json();
      if (data.id && data.title) {
        setApiTitle(data.title);
        if (data.title.trim().toLowerCase() !== providedTitle.trim().toLowerCase()) {
          setErrorMessage(`Title mismatch! Expected: "${data.title}"`);
          return false;
        }
        setErrorMessage(null);
        return true;
      } else {
        throw new Error("DOI not recognized.");
      }
    } catch (error) {
      setErrorMessage("Invalid DOI. Please check and try again.");
      return false;
    }
  }

  async function mintSBT(title: string, doi: string, repository: string) {
    try {
      if (!window.ethereum) throw new Error("MetaMask is not installed.");
      const web3 = new Web3(window.ethereum);
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const accounts = await web3.eth.getAccounts();
      const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
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
    setIsSubmitting(true);
    setShowModal(true);

    const isValid = await checkPaperValidity(values.doi, values.title);
    if (!isValid) {
      setIsSubmitting(false);
      setShowModal(false);
      return;
    }

    try {
      const transactionHash = await mintSBT(values.title, values.doi, values.repository || "");
      submittedDOIs.add(values.doi);

      toast({
        title: "SBT Minted Successfully!",
        description: `Transaction Hash: ${transactionHash}`,
      });

      form.reset();
      setErrorMessage(null);
      setApiTitle(null);
      setShowModal(false);
    } catch (error) {
      toast({
        title: "Minting Failed",
        description: "Transaction could not be processed. Try again.",
        variant: "destructive",
      });
      setShowModal(false);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="container py-10 relative">
      <div className="mx-auto max-w-2xl">
        <Card className="border-primary/20 shadow-lg shadow-primary/5">
          <CardHeader>
            <CardTitle>Submit Your Research Paper</CardTitle>
            <CardDescription>Provide the DOI and details to mint an SBT.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField control={form.control} name="doi" render={({ field }) => (
                  <FormItem>
                    <FormLabel>DOI</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter DOI (e.g., 10.1234/example)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="title" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Research Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="repository" render={({ field }) => (
                  <FormItem>
                    <FormLabel>GitHub / Repository (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter repository link" {...field} />
                    </FormControl>
                  </FormItem>
                )} />

                <FormField control={form.control} name="abstract" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Abstract / Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Brief description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                {errorMessage && <p className="text-red-500 font-semibold">{errorMessage}</p>}

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit & Mint SBT"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Card className="p-6 text-center max-w-md">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
              <h2 className="text-lg font-semibold mt-2">Minting SBT...</h2>
              <p className="text-sm text-gray-500">Your research contribution is being verified and minted.</p>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
