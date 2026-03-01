"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, ChevronDown, MessageCircle, Mail, ExternalLink, BookOpen, Zap, Linkedin } from "lucide-react";
import Link from "next/link";

const faqs = [
    {
        q: "What is APT AI?",
        a: "APT AI is the most comprehensive AI tool discovery platform. We help you find, compare, and choose the perfect AI tool from our directory of 46,600+ tools across 200+ categories.",
    },
    {
        q: "How do I find the right AI tool?",
        a: "You can browse categories, use our powerful search, or take our interactive quiz at /quiz to get personalized recommendations based on your needs, role, and budget.",
    },
    {
        q: "Is APT AI free to use?",
        a: "Yes! Browsing, searching, and comparing tools on APT AI is completely free. Some premium features like advanced analytics and early access to new tools may be available in the future.",
    },
    {
        q: "How do I submit my AI tool?",
        a: "Visit the Submit Tool page (/submit) and fill out the form with your tool's details. Our team reviews submissions within 48 hours.",
    },
    {
        q: "How are tools ranked?",
        a: "Tools are ranked based on a combination of user reviews, ratings, view counts, save counts, and editorial quality assessment. Visit our Leaderboard page to see the top-ranked tools.",
    },
    {
        q: "Can I save tools for later?",
        a: "Yes! Click the save/bookmark icon on any tool card to add it to your personal collection. You can also create custom collections to organize tools by project or workflow.",
    },
    {
        q: "What is Free Mode?",
        a: "Free Mode filters the entire directory to show only completely free AI tools. Toggle it on using the 'Free mode' button in the navigation bar.",
    },
];

export default function HelpPage() {
    const [openFaq, setOpenFaq] = useState<number | null>(0);

    return (
        <div className="pb-24 lg:pb-8 px-4 lg:px-8 max-w-3xl mx-auto">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="pt-8 pb-6 text-center"
            >
                <div className="w-14 h-14 rounded-2xl bg-[var(--color-primary)]/10 flex items-center justify-center mx-auto mb-4 border border-[var(--color-primary)]/20">
                    <HelpCircle size={28} className="text-[var(--color-primary)]" />
                </div>
                <h1 className="text-2xl lg:text-3xl font-bold text-[var(--text-primary)] mb-2">
                    Help Center
                </h1>
                <p className="text-sm text-[var(--text-tertiary)]">
                    Everything you need to know about using APT AI
                </p>
            </motion.div>

            {/* Quick links */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8"
            >
                {[
                    { icon: BookOpen, label: "Getting Started", desc: "Learn the basics", href: "/" },
                    { icon: Zap, label: "Take the Quiz", desc: "Find your match", href: "/quiz" },
                    { icon: MessageCircle, label: "Contact Us", desc: "Get in touch", href: "mailto:help@aptai.com" },
                ].map((item) => (
                    <Link
                        key={item.label}
                        href={item.href}
                        className="clay-card p-4 flex items-center gap-3 group"
                    >
                        <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center shrink-0 border border-[var(--color-primary)]/20">
                            <item.icon size={18} className="text-[var(--color-primary)]" />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-[var(--color-primary-light)] transition-colors">
                                {item.label}
                            </h3>
                            <p className="text-xs text-[var(--text-muted)]">{item.desc}</p>
                        </div>
                    </Link>
                ))}
            </motion.div>

            {/* FAQs */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
                    Frequently Asked Questions
                </h2>
                <div className="space-y-2">
                    {faqs.map((faq, i) => (
                        <div key={i} className="clay-card overflow-hidden" style={{ cursor: "default" }}>
                            <button
                                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                className="w-full flex items-center justify-between p-4 text-left"
                            >
                                <span className="text-sm font-medium text-[var(--text-primary)] pr-4">{faq.q}</span>
                                <motion.div
                                    animate={{ rotate: openFaq === i ? 180 : 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="shrink-0"
                                >
                                    <ChevronDown size={16} className="text-[var(--text-muted)]" />
                                </motion.div>
                            </button>
                            <AnimatePresence>
                                {openFaq === i && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="px-4 pb-4 text-sm text-[var(--text-tertiary)] border-t border-[var(--border-default)] pt-3">
                                            {faq.a}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Contact CTA */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-8 clay-card p-6 text-center"
                style={{ cursor: "default" }}
            >
                <h3 className="text-base font-semibold text-[var(--text-primary)] mb-1">
                    Still need help?
                </h3>
                <p className="text-sm text-[var(--text-tertiary)] mb-4">
                    Our team is here to assist you
                </p>
                <div className="flex items-center justify-center gap-3">
                    <a
                        href="mailto:help@aptai.com"
                        className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-light)] text-white text-sm font-semibold transition-all shadow-lg shadow-[var(--color-primary)]/25"
                    >
                        <Mail size={14} />
                        Email Support
                    </a>
                    <a
                        href="https://www.linkedin.com/in/darshit-sheth-320388187/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#0A66C2] hover:bg-[#0A66C2]/80 text-white text-sm font-semibold transition-all shadow-lg shadow-[#0A66C2]/25"
                    >
                        <Linkedin size={14} />
                        Connect on LinkedIn
                    </a>
                </div>
            </motion.div>
        </div>
    );
}
