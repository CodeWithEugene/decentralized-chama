'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Phone, Mail, Linkedin, Github } from 'lucide-react'

export function PrivacyPopup() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" className="hover:text-foreground transition-colors">
          Privacy
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Privacy Policy</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 text-sm text-muted-foreground">
          <p>
            DChama is designed to protect your privacy while maintaining transparency within your savings group.
          </p>
          <h4 className="font-semibold text-foreground">Privacy Layer</h4>
          <p>
            We use a Privacy Layer managed by the KRNL Token Authority to link your blockchain wallet address to your real name. This mapping is confidential and is **only revealed to members within your specific DChama group**. It is never exposed publicly.
          </p>
          <h4 className="font-semibold text-foreground">Blockchain Transactions</h4>
          <p>
            All financial transactions are recorded on the blockchain and are tied to your pseudonymous wallet address, not your real name.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function TermsPopup() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" className="hover:text-foreground transition-colors">
          Terms
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Terms of Service</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 text-sm text-muted-foreground">
          <h4 className="font-semibold text-foreground">Service Overview</h4>
          <p>
            DChama is a decentralized application that automates Rotating Savings and Credit Associations (ROSCAs). Members contribute a fixed amount, and the pool is disbursed to one member each month in rotation.
          </p>
          <h4 className="font-semibold text-foreground">User Responsibilities</h4>
          <p>
            You are responsible for the security of your own wallet. You agree to make contributions on time as per your group's rules.
          </p>
          <h4 className="font-semibold text-foreground">Security Features</h4>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Checks-Effects-Interactions:</strong> Prevents re-entrancy attacks by updating state before sending funds.
            </li>
            <li>
              <strong>KRNL-Only Access:</strong> Ensures only the automated system can trigger payouts, preventing manual abuse.
            </li>
            <li>
              <strong>Integer Overflow Protection:</strong> Built-in protection with Solidity 0.8+ to prevent balance manipulation.
            </li>
            <li>
              <strong>Pull-over-Push Payments:</strong> You will "claim" your payout, which prevents the contract from getting stuck if your wallet has issues.
            </li>
          </ul>
          <h4 className="font-semibold text-foreground">Disclaimer</h4>
          <p>
            DChama is provided "as is". The use of blockchain technology involves inherent risks.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function ContactPopup() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" className="hover:text-foreground transition-colors">
          Contact
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Contact Me</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            <a href="tel:+254746152008">+254746152008</a>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            <a href="mailto:eugenegabriel.ke@gmail.com">eugenegabriel.ke@gmail.com</a>
          </div>
          <div className="flex items-center gap-2">
            <Linkedin className="w-4 h-4" />
            <a href="https://linkedin.com/in/eugene-mutembei" target="_blank" rel="noopener noreferrer">
              Eugene Mutembei
            </a>
          </div>
          <div className="flex items-center gap-2">
            <Github className="w-4 h-4" />
            <a href="https://github.com/CodeWithEugene/" target="_blank" rel="noopener noreferrer">
              CodeWithEugene
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
