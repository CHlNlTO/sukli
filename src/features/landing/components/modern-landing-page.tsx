"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Spotlight } from "@/components/ui/spotlight-new";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { SignUpButton, SignInButton } from "@clerk/nextjs";
import { Plus, Zap, Shield } from "lucide-react";
import { useFileUpload } from "@/features/file-upload/hooks/use-file-upload";
import { ParsedReceiptCard } from "@/features/transactions/components/parsed-receipt-card";
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useTheme } from "next-themes"
import {
  Check,
  Camera,
  Cloud,
  Folder,
  ArrowRight,
  Star,
  BarChart,
} from "lucide-react"
import Link from "next/link";

export function ModernLandingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const {
    uploadedImages,
    // isUploading,
    uploadFiles,
    removeImage,
    saveTransaction,
  } = useFileUpload();

  const navItems = [
    { name: "Features", link: "#features" },
    { name: "Testimonials", link: "#testimonials" },
    { name: "Pricing", link: "#pricing" },
    { name: "FAQ", link: "#faq" },
  ];

  const [_isScrolled, setIsScrolled] = useState(false)
  const [_mobileMenuOpen, _setMobileMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const [_mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // const toggleTheme = () => {
  //   setTheme(theme === "dark" ? "light" : "dark")
  // }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  const features = [
    {
      title: "Snap-to-Save",
      description: "Just take a photo of your receipt — our AI instantly extracts and records your expense.",
      icon: <Camera className="size-5 text-blue-500" />,
    },
    {
      title: "Lightning-Fast Parsing",
      description: "Our advanced AI reads and categorizes receipts in seconds, with high accuracy.",
      icon: <Zap className="size-5 text-blue-500" />,
    },
    {
      title: "Real-Time Expense Tracking",
      description: "See your spending update in real-time as you upload receipts — no manual input needed.",
      icon: <BarChart className="size-5 text-blue-500" />,
    },
    {
      title: "Smart Categorization",
      description: "Automatically assigns expenses to categories like food, travel, utilities, and more.",
      icon: <Folder className="size-5 text-blue-500" />,
    },
    {
      title: "Cloud-Synced Records",
      description: "Access your expenses anytime, anywhere — securely stored in the cloud.",
      icon: <Cloud className="size-5 text-blue-500" />,
    },
    {
      title: "Privacy & Security",
      description: "Your data is encrypted and protected by enterprise-grade security standards.",
      icon: <Shield className="size-5 text-blue-500" />,
    },
  ]


  // const handleFileUpload = (files: File[]) => {
  //   uploadFiles(files);
  // };

  return (
    <div className="dark:bg-zinc-950 relative overflow-hidden">
      {/* Modern Navbar */}
      <Navbar>
        <NavBody>
          <NavbarLogo>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 hover:-translate-y-0.5 transition duration-200 bg-gradient-to-b from-blue-500 to-blue-700 text-white shadow-[0px_2px_0px_0px_rgba(255,255,255,0.3)_inset] rounded-sm flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="text-xl text-black font-semibold ">Sukli</span>
            </div>
          </NavbarLogo>

          <NavItems items={navItems} className="hidden md:flex space-x-8" />

          <div className="flex items-center gap-4">
            <SignInButton mode="modal">
              <NavbarButton variant="gradient">Sign In</NavbarButton>
            </SignInButton>
            {/* <SignUpButton mode="modal">
              <NavbarButton variant="primary">Get Started</NavbarButton>
            </SignUpButton> */}
          </div>
        </NavBody>

        <MobileNav>
          <MobileNavHeader>
            {/* <NavbarLogo> */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="text-xl font-semibold text-black">Sukli</span>
            </div>
            {/* </NavbarLogo> */}
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-black dark:text-gray-300 hover:text-white transition-colors py-2 block"
              >
                {item.name}
              </a>
            ))}
            <div className="flex flex-col gap-3 w-full">
              <SignInButton mode="modal">
                <NavbarButton variant="gradient" className="w-full text-xs">
                  <span className="text-xs">Sign In</span>
                </NavbarButton>
              </SignInButton>
              <SignUpButton mode="modal">
                <NavbarButton variant="primary" className="w-full text-xs">
                  <span className="text-xs">Get Started</span>
                </NavbarButton>
              </SignUpButton>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
      <Spotlight />
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />
      <div className="absolute inset-0 bg-noise" />

        <main className="relative min-h-screen flex flex-col items-center justify-center mx-auto">
          {/* Hero Section */}
          <section className="w-full flex flex-col items-center justify-center pt-20 pb-20 md:pb-32 lg:pb-40 overflow-hidden">
            <div className="container px-4 md:px-6 relative">
              <div className="absolute inset-0 -z-10 h-full w-full mt-12 bg-white dark:bg-black bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center max-w-3xl mx-auto mb-12"
              >
                <Badge className="my-8 rounded-full px-4 py-1.5 text-sm font-medium" variant="secondary">
                  Launching Soon
                </Badge>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-950 to-blue-950">
                  Add Expenses in <br/> 5 Seconds, Not Minutes
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Our smart AI reads your receipt, understands the details, and instantly saves the expense — categorized and ready to go.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <SignInButton mode="modal">
                    <Button size="lg" className="rounded-full h-12 px-8 hover:cursor-pointer hover:-translate-y-0.5 transition duration-200 bg-gradient-to-b from-blue-500 to-blue-700 text-white shadow-[0px_2px_0px_0px_rgba(255,255,255,0.3)_inset] flex items-center justify-center">
                      Start for free
                      <ArrowRight className="ml-2 size-4" />
                    </Button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <Button size="lg" variant="outline" className="rounded-full h-12 px-8 hover:cursor-pointer hover:-translate-y-0.5 transition duration-200 bg-gradient-to-b from-white to-gray-200 text-black shadow-[0px_2px_0px_0px_rgba(255,255,255,0.3)_inset] flex items-center justify-center">
                      Get Started
                    </Button>
                  </SignUpButton>
                  {/* <ModernUploadZone
                    onFileUpload={handleFileUpload}
                    isUploading={isUploading}
                  /> */}
                </div>
                {/* Upload Zone */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="max-w-md mx-auto"
                >
                </motion.div>
                <div className="flex items-center justify-center gap-4 mt-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Check className="size-4 text-blue-500" />
                    <span>No credit card</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Check className="size-4 text-blue-500" />
                    <span>14-day trial</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Check className="size-4 text-blue-500" />
                    <span>Cancel anytime</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="relative mx-auto max-w-5xl"
              >
                {/* Parsed Results Section */}
                {uploadedImages.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative z-10 max-w-7xl mx-auto px-4 pb-20"
                  >
                    <div className="text-center mb-12">
                      <h2 className="text-5xl font-bold text-black dark:text-white mb-4">
                        Your Parsed Receipts
                      </h2>
                      <p className="text-gray-400">
                        Review and save your extracted transaction data
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {uploadedImages.map((image) => (
                        <motion.div
                          key={image.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ParsedReceiptCard
                            image={image}
                            onSave={saveTransaction}
                            onDiscard={removeImage}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="relative mx-auto max-w-5xl"
              >
                <div className="rounded-xl overflow-hidden shadow-2xl border border-border/40 bg-gradient-to-b from-background to-muted/20">
                  <Image
                    src="/sukli-ui.png"
                    width={1280}
                    height={720}
                    alt="SaaSify dashboard"
                    className="w-full h-auto"
                    priority
                  />
                  <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-black/10 dark:ring-white/10"></div>
                </div>
                <div className="absolute -bottom-6 -right-6 -z-10 h-[300px] w-[300px] rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 blur-3xl opacity-70"></div>
                <div className="absolute -top-6 -left-6 -z-10 h-[300px] w-[300px] rounded-full bg-gradient-to-br from-secondary/30 to-primary/30 blur-3xl opacity-70"></div>
              </motion.div>

            </div>
          </section>

          {/* Logos Section */}
          <section className="w-full flex flex-col items-center justify-center py-12 border-y bg-muted/30">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <p className="text-sm font-medium text-muted-foreground">Trusted by innovative companies worldwide</p>
                <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 lg:gap-16">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Image
                      key={i}
                      src={`/placeholder-logo.svg`}
                      alt={`Company logo ${i}`}
                      width={120}
                      height={60}
                      className="h-8 w-auto opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0"
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section id="features" className="w-full flex flex-col items-center justify-center py-20 md:py-32">
            <div className="container px-4 md:px-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
              >
                <Badge className="rounded-full px-4 py-1.5 text-sm font-medium" variant="secondary">
                  Features
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Everything You Need to Succeed</h2>
                <p className="max-w-[800px] text-muted-foreground md:text-lg">
                  Our comprehensive platform provides all the tools you need to streamline your workflow, boost
                  productivity, and achieve your goals.
                </p>
              </motion.div>

              <motion.div
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
              >
                {features.map((feature, i) => (
                  <motion.div key={i} variants={item}>
                    <Card className="h-full overflow-hidden border-border/40 bg-gradient-to-b from-background to-muted/10 backdrop-blur transition-all hover:shadow-md">
                      <CardContent className="p-6 flex flex-col h-full">
                        <div className="size-10 rounded-full bg-blue-500/10 dark:bg-primary/20 flex items-center justify-center text-primary mb-4">
                          {feature.icon}
                        </div>
                        <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                        <p className="text-muted-foreground">{feature.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>

          {/* How It Works Section */}
          <section className="w-full flex flex-col items-center justify-center py-20 md:py-32 bg-muted/30 relative overflow-hidden">
            <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-black bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_40%,transparent_100%)]"></div>

            <div className="container px-4 md:px-6 relative">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center justify-center space-y-4 text-center mb-16"
              >
                <Badge className="rounded-full px-4 py-1.5 text-sm font-medium" variant="secondary">
                  How It Works
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Simple Process, Powerful Results</h2>
                <p className="max-w-[800px] text-muted-foreground md:text-lg">
                  Get started in minutes and see the difference our app can make for your finances.
                </p>
              </motion.div>

              <div className="grid md:grid-cols-3 gap-8 md:gap-12 relative">
                <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-border to-transparent -translate-y-1/2 z-0"></div>

                {[
                  {
                    step: "01",
                    title: "Capture",
                    description: "GCash receipts, bills, and invoices are captured with a single snap.",
                  },
                  {
                    step: "02",
                    title: "Wait",
                    description: "Our AI processes your receipts and extracts relevant data.",
                  },
                  {
                    step: "03",
                    title: "Track",
                    description: "Every expense saved and categorized in real time",
                  },
                ].map((step, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="relative z-10 flex flex-col items-center text-center space-y-4"
                  >
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 text-primary-foreground text-xl font-bold shadow-lg">
                      {step.step}
                    </div>
                    <h3 className="text-xl font-bold">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Testimonials Section */}
          <section id="testimonials" className="w-full flex flex-col items-center justify-center py-20 md:py-32">
            <div className="container px-4 md:px-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
              >
                <Badge className="rounded-full px-4 py-1.5 text-sm font-medium" variant="secondary">
                  Testimonials
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Loved by Teams Worldwide</h2>
                <p className="max-w-[800px] text-muted-foreground md:text-lg">
                  Don&apos;t just take our word for it. See what our customers have to say about their experience.
                </p>
              </motion.div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    quote:
                      "Sobrang convenient! I just take a photo of my receipt, tap upload, and the app saves everything for me. No more writing down expenses one by one.",
                    author: "Andrea Santos",
                    role: "Freelance Graphic Designer",
                    rating: 5,
                  },
                  {
                    quote:
                      "As a student, I always lose track of my daily gastos. But since I started using this app, I became more aware of where my allowance goes. Super helpful!",
                    author: "Mark De Guzman",
                    role: "College Student",
                    rating: 5,
                  },
                  {
                    quote:
                      "Dating ang gulo ng budget ko, but this app made everything organized. I just upload my receipts and the app does the rest. Nakakatuwa!",
                    author: "Jen Dela Cruz",
                    role: "Fresh Graduate, Job Seeker",
                    rating: 5,
                  },
                  {
                    quote:
                      "I'm always on the move for work, so having a tool that lets me track expenses just by snapping a photo is a game-changer. No hassle, no stress.",
                    author: "Carlos Ramirez",
                    role: "Sales Agent",
                    rating: 5,
                  },
                  {
                    quote:
                      "I used to delay logging my expenses kasi nakakatamad. Pero ngayon, parang selfie lang — picture-an lang yung resibo, tapos na agad.",
                    author: "Rica Montemayor",
                    role: "Online Seller / WFH Mom",
                    rating: 5,
                  },
                  {
                    quote:
                      "I never thought managing my money could be this easy. The app helps me stick to my budget and even alerts me when I overspend. Ang galing!",
                    author: "Leo Villanueva",
                    role: "Virtual Assistant",
                    rating: 5,
                  },
                ].map((testimonial, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.05 }}
                  >
                    <Card className="h-full overflow-hidden border-border/40 bg-gradient-to-b from-background to-muted/10 backdrop-blur transition-all hover:shadow-md">
                      <CardContent className="p-6 flex flex-col h-full">
                        <div className="flex mb-4">
                          {Array(testimonial.rating)
                            .fill(0)
                            .map((_, j) => (
                              <Star key={j} className="size-4 text-yellow-500 fill-yellow-500" />
                            ))}
                        </div>
                        <p className="text-lg mb-6 flex-grow">{testimonial.quote}</p>
                        <div className="flex items-center gap-4 mt-auto pt-4 border-t border-border/40">
                          <div className="size-10 rounded-full bg-muted flex items-center justify-center text-foreground font-medium">
                            {testimonial.author.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium">{testimonial.author}</p>
                            <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Pricing Section */}
          <section id="pricing" className="w-full flex flex-col items-center justify-center py-20 md:py-32 bg-muted/30 relative overflow-hidden">
            <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-black bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_40%,transparent_100%)]"></div>

            <div className="container px-4 md:px-6 relative">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
              >
                <Badge className="rounded-full px-4 py-1.5 text-sm font-medium" variant="secondary">
                  Pricing
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Simple, Transparent Pricing</h2>
                <p className="max-w-[800px] text-muted-foreground md:text-lg">
                  Start free. Upgrade anytime.
                </p>
              </motion.div>

              <div className="mx-auto max-w-4xl">
                <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
                  {[
                    {
                      name: "Free",
                      price: "₱0",
                      description: "Perfect for light users and budget trackers.",
                      features: [
                        "Up to 5 image uploads per day",
                        "Manual input support",
                        "Basic expense tracking",
                        "Add your own Gemini API key to increase limit",
                        "Access from any device",
                      ],
                      cta: "Get Started",
                    },
                    {
                      name: "Pro",
                      price: "₱200",
                      description: "For serious budgeters and power users.",
                      features: [
                        "Unlimited image uploads",
                        "No ads, no limits",
                        "Advanced spending analytics",
                        "Smart categorization",
                        "Priority support",
                      ],
                      cta: "Subscribe Now",
                      popular: true,
                    },
                  ].map((plan, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                    >
                      <Card
                        className={`relative overflow-hidden h-full ${
                          plan.popular ? "border-blue-600 shadow-lg" : "border-border/40 shadow-md"
                        } bg-gradient-to-b from-background to-muted/10 backdrop-blur`}
                      >
                        {plan.popular && (
                          <div className="absolute top-0 right-0 bg-blue-600 text-primary-foreground px-3 py-1 text-xs font-medium rounded-bl-lg">
                            Most Popular
                          </div>
                        )}
                        <CardContent className="p-6 flex flex-col h-full">
                          <h3 className="text-2xl font-bold">{plan.name}</h3>
                          <div className="flex items-baseline mt-4">
                            <span className="text-4xl font-bold">{plan.price}</span>
                            <span className="text-muted-foreground ml-1">/month</span>
                          </div>
                          <p className="text-muted-foreground mt-2">{plan.description}</p>
                          <ul className="space-y-3 my-6 flex-grow">
                            {plan.features.map((feature, j) => (
                              <li key={j} className="flex items-center">
                                <Check className="mr-2 size-4 text-primary" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                          <Button
                            className={`w-full mt-auto rounded-full cursor-pointer ${
                              plan.popular ? "hover:-translate-y-0.5 transition duration-200 bg-gradient-to-b from-blue-500 to-blue-700 text-white shadow-[0px_2px_0px_0px_rgba(255,255,255,0.3)_inset]" : "hover:cursor-pointer hover:-translate-y-0.5 transition duration-200 bg-gradient-to-b from-white to-gray-200 text-black shadow-[0px_2px_0px_0px_rgba(255,255,255,0.3)_inset]"
                            }`}
                            variant={plan.popular ? "default" : "outline"}
                          >
                            {plan.cta}
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>

            </div>
          </section>

          {/* FAQ Section */}
          <section id="faq" className="w-full flex flex-col items-center justify-center py-20 md:py-32">
            <div className="container px-4 md:px-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
              >
                <Badge className="rounded-full px-4 py-1.5 text-sm font-medium" variant="secondary">
                  FAQ
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Frequently Asked Questions</h2>
                <p className="max-w-[800px] text-muted-foreground md:text-lg">
                  Find answers to common questions about our platform.
                </p>
              </motion.div>

              <div className="mx-auto max-w-3xl">
                <Accordion type="single" collapsible className="w-full">
                  {[
                    {
                      question: "Is the app really free?",
                      answer:
                        "Yes! Our Free plan lets you upload up to 5 receipt photos per day. You can also add your own Gemini API key to increase that limit without paying anything.",
                    },
                    {
                      question: "What do I get with the ₱200/month Pro plan?",
                      answer:
                        "With the Pro plan, you get unlimited receipt uploads, no ads, advanced spending analytics, and priority support. It's designed for users who want more flexibility and detailed insights.",
                    },
                    {
                      question: "Can I switch plans anytime?",
                      answer:
                        "Yes, you can upgrade or cancel your plan anytime. If you move to the Pro plan, it will start immediately and renew monthly unless canceled.",
                    },
                    {
                      question: "How do I use my own Gemini API key?",
                      answer:
                        "In the app settings, you’ll find an option to paste your own Gemini API key. This allows you to bypass the daily image limit on the Free plan by using your own quota.",
                    },
                    {
                      question: "Is my data safe?",
                      answer:
                        "Absolutely. Your receipts and expense data are encrypted and securely stored. We follow best practices in security to ensure your personal information is protected.",
                    },
                    {
                      question: "Who is this app for?",
                      answer:
                        "This app is made for anyone who wants an easier way to track their expenses — students, freelancers, busy professionals, even small business owners. Just snap a photo of your receipt and you're done!",
                    },
                  ].map((faq, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                    >
                      <AccordionItem value={`item-${i}`} className="border-b border-border/40 py-2">
                        <AccordionTrigger className="text-left font-medium hover:no-underline cursor-pointer">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                      </AccordionItem>
                    </motion.div>
                  ))}
                </Accordion>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="w-full flex flex-col items-center justify-center py-20 md:py-32 bg-gradient-to-br from-blue-600 to-blue-500 text-white relative overflow-hidden">
            <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#3b82f610_1px,transparent_1px),linear-gradient(to_bottom,#3b82f610_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-300 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-blue-300 rounded-full blur-3xl"></div>


            <div className="container px-4 md:px-6 relative">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center justify-center space-y-6 text-center"
              >
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
                  Tired of Forgetting Where Your Money Went?
                </h2>
                <p className="mx-auto max-w-[700px] text-primary-foreground/80 md:text-xl">
                  Start tracking your expenses the smart way — just snap a photo of your receipt and let our AI do the rest.
                  Join thousands of users simplifying their money habits today.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mt-4">
                  <SignInButton mode="modal">
                    <Button size="lg" className="rounded-full h-12 px-8 hover:cursor-pointer hover:-translate-y-0.5 transition duration-200 bg-gradient-to-b from-blue-500 to-blue-700 text-white shadow-[0px_2px_0px_0px_rgba(255,255,255,0.3)_inset] flex items-center justify-center">
                      Start for free
                      <ArrowRight className="ml-2 size-4" />
                    </Button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <Button size="lg" variant="outline" className="rounded-full h-12 px-8 hover:cursor-pointer hover:-translate-y-0.5 transition duration-200 bg-gradient-to-b from-white to-gray-200 text-black shadow-[0px_2px_0px_0px_rgba(255,255,255,0.3)_inset] flex items-center justify-center">
                      Get Started
                    </Button>
                  </SignUpButton>
                </div>
                <p className="text-sm text-primary-foreground/80 mt-4">
                  No credit card required. 14-day free trial. Cancel anytime.
                </p>
              </motion.div>
            </div>
          </section>

        </main>
        <footer className="w-full flex flex-col items-center justify-center border-t bg-background/95 backdrop-blur-sm">
          <div className="container flex flex-col gap-8 px-4 py-10 md:px-6 lg:py-16">
            <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
              <div className="space-y-4">
                <div className="flex items-center gap-2 font-bold">
                  <div className="size-8 rounded-lg bg-gradient-to-b from-blue-500 to-blue-700 text-white flex items-center justify-center">
                    S
                  </div>
                  <span>Sukli</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Our smart AI reads your receipt, understands the details, and instantly saves the expense — categorized and ready to go.
                </p>
                <div className="flex gap-4">
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="size-5"
                    >
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                    </svg>
                    <span className="sr-only">Facebook</span>
                  </Link>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="size-5"
                    >
                      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                    </svg>
                    <span className="sr-only">Twitter</span>
                  </Link>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="size-5"
                    >
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                      <rect width="4" height="12" x="2" y="9"></rect>
                      <circle cx="4" cy="4" r="2"></circle>
                    </svg>
                    <span className="sr-only">LinkedIn</span>
                  </Link>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-sm font-bold">Product</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                      Pricing
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                      Integrations
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                      API
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="text-sm font-bold">Resources</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                      Documentation
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                      Guides
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                      Support
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="text-sm font-bold">Company</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                      About
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                      Careers
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                      Terms of Service
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row justify-between items-center border-t border-border/40 pt-8">
              <p className="text-xs text-muted-foreground">
                &copy; {new Date().getFullYear()} Sukli. All rights reserved.
              </p>
              <div className="flex gap-4">
                <Link href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
                <Link href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
                <Link href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                  Cookie Policy
                </Link>
              </div>
            </div>
          </div>
        </footer>
    </div>
  );
}

// Modern Upload Zone Component
// function ModernUploadZone({
//   onFileUpload,
//   isUploading,
// }: {
//   onFileUpload: (files: File[]) => void;
//   isUploading: boolean;
// }) {
//   const [isDragOver, setIsDragOver] = useState(false);

//   const handleDrop = (e: React.DragEvent) => {
//     e.preventDefault();
//     setIsDragOver(false);
//     const files = Array.from(e.dataTransfer.files).filter((file) =>
//       file.type.startsWith("image/")
//     );
//     if (files.length > 0) {
//       onFileUpload(files);
//     }
//   };

//   const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = Array.from(e.target.files || []);
//     if (files.length > 0) {
//       onFileUpload(files);
//     }
//   };

//   return (
//     <Button className="relative group bg-transparent h-12 hover:bg-transparent shadow-none hover:shadow-none hover:-translate-y-0.5 transition duration-200 flex items-center justify-center">
//       <motion.div
//         whileHover={{ scale: 1.02 }}
//         whileTap={{ scale: 0.98 }}
//         className={`relative overflow-hidden rounded-2xl  transition-all duration-300 ${
//           isDragOver
//             ? "border-blue-400 bg-blue-500/10"
//             : "border-gray-600 hover:border-gray-500"
//         } ${isUploading ? "pointer-events-none opacity-70" : ""}`}
//         onDrop={handleDrop}
//         onDragOver={(e) => {
//           e.preventDefault();
//           setIsDragOver(true);
//         }}
//         onDragLeave={() => setIsDragOver(false)}
//       >
//         <input
//           type="file"
//           accept="image/*"
//           multiple
//           onChange={handleFileSelect}
//           className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
//           disabled={isUploading}
//         />

//         <div className="glass-card text-center">
//           <motion.div
//             animate={isUploading ? { rotate: 360 } : {}}
//             transition={{
//               duration: 2,
//               repeat: isUploading ? Infinity : 0,
//               ease: "linear",
//             }}
//             className={`rounded-full h-12 px-4 hover:cursor-pointer hover:-translate-y-0.5 transition duration-200 bg-gradient-to-b from-blue-500 to-blue-700 text-white shadow-[0px_2px_0px_0px_rgba(255,255,255,0.3)_inset] flex items-center justify-center ${
//               isUploading
//                 ? "bg-blue-500/20"
//                 : "rounded-full h-12 px-4 hover:cursor-pointer hover:-translate-y-0.5 transition duration-200 text-white shadow-[0px_2px_0px_0px_rgba(255,255,255,0.3)_inset] flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500"
//             } transition-all duration-300`}
//           >
//             {isUploading ? (
//               <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
//             ) : (
//               <>
//                 Add a receipt
//                 <Plus className="ml-2 size-4" />
//               </>
//             )}
//           </motion.div>
//         </div>
//       </motion.div>
//     </Button>
//   );
// }
