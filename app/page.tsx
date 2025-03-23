"use client"

import { Button } from "@/components/ui/button"
import { ConnectWalletButton } from "@/components/connect-wallet-button"
import { ProcessStep } from "@/components/process-step"
import { NetworkAnimation } from "@/components/network-animation"
import Link from "next/link"
import { ArrowRight, FileText, Award, CheckCircle, ExternalLink } from "lucide-react"
import { motion } from "framer-motion"

export default function LandingPage() {
  return (
    <main className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="relative w-full py-12 md:py-24 lg:py-32 xl:py-48 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <NetworkAnimation />
        </div>
        <div className="container px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center space-y-4 text-center">
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Revolutionizing Scientific Reputation with Web3
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Verify contributions, earn Soulbound Tokens, and build your decentralized research reputation.
              </p>
            </motion.div>
            <motion.div
              className="space-x-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <ConnectWalletButton />
              <Link href="/dashboard">
                <Button variant="outline" className="group">
                  Explore Dashboard
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50 dark:bg-muted/10">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-2">
                Simple Process
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How It Works</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Three simple steps to build your decentralized scientific reputation
              </p>
            </motion.div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:gap-12 py-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1, duration: 0.5 }}
              >
                <ProcessStep
                  number={1}
                  title="Submit Your Work"
                  description="Upload your research papers, peer reviews, or open-source contributions"
                  icon={<FileText className="h-10 w-10" />}
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <ProcessStep
                  number={2}
                  title="Get Verified"
                  description="Community validation ensures the authenticity of your contributions"
                  icon={<CheckCircle className="h-10 w-10" />}
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <ProcessStep
                  number={3}
                  title="Earn SBTs"
                  description="Receive Soulbound Tokens as permanent proof of your scientific contributions"
                  icon={<Award className="h-10 w-10" />}
                />
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <Button size="lg" asChild className="group">
                <Link href="/submit">
                  Start Contributing
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
            <motion.div
              className="flex flex-col justify-center space-y-4"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary w-fit mb-2">
                Web3 Powered
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Decentralized Science</h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform leverages Web3 technology to create a transparent, immutable record of scientific
                  contributions, revolutionizing how research impact is measured and rewarded.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/about">
                  <Button variant="outline" className="w-full min-[400px]:w-auto group">
                    Learn More
                    <ExternalLink className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button className="w-full min-[400px]:w-auto">View Dashboard</Button>
                </Link>
              </div>
            </motion.div>
            <motion.div
              className="flex items-center justify-center relative"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative h-[300px] w-[300px] md:h-[400px] md:w-[400px] lg:h-[500px] lg:w-[500px]">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-primary/20 opacity-80 blur-3xl"></div>
                <motion.div
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-background/80 backdrop-blur-sm p-6 shadow-lg w-64"
                  initial={{ y: 0 }}
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                >
                  <div className="space-y-2 text-center">
                    <h3 className="text-xl font-bold">Soulbound Tokens</h3>
                    <p className="text-sm text-muted-foreground">
                      Non-transferable tokens that represent your scientific achievements
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  )
}

