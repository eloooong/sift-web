import { cn } from "@/lib/utils";

// Generated from the approved Scout artwork; see design/sift-logo-concepts/selected/build.py.
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="20 24 216 216"
      aria-hidden="true"
      focusable="false"
      className={cn("size-8 shrink-0", className)}
    >
      <path fill="var(--foreground)" d="M45 36L88 58C112 48 141 48 166 60L209 34L203 105C221 134 218 174 198 201L208 219L173 215C146 233 107 234 79 216L46 220L56 201C35 176 31 139 47 110Z" />
      <path fill="var(--muted-foreground)" d="M62 69L86 82L64 99ZM190 68L168 83L192 99Z" />
      <path fill="var(--background)" d="M57 121C58 82 102 74 127 107C150 76 196 89 197 128C198 166 167 192 128 211C89 193 55 166 57 121Z" />
      <path fill="var(--secondary)" d="M69 158C83 178 102 191 128 204C153 192 173 178 187 159C169 166 149 167 128 159C108 168 88 167 69 158Z" />
      <circle cx="91" cy="125" r="20" fill="var(--foreground)" />
      <circle cx="160" cy="127" r="31" fill="var(--muted-foreground)" />
      <circle cx="160" cy="127" r="23" fill="var(--background)" />
      <circle cx="158" cy="126" r="12" fill="var(--foreground)" />
      <circle cx="95" cy="120" r="5" fill="var(--background)" />
      <circle cx="162" cy="121" r="4" fill="var(--background)" />
      <path fill="var(--foreground)" d="M116 143L128 156L140 143L128 137Z" />
      <path fill="var(--muted-foreground)" d="M184 150L212 174L205 182L177 157Z" />
      <path fill="var(--foreground)" d="M115 177L128 184L141 177L128 193Z" />
      <path fill="var(--background)" d="M90 200L94 207L98 200L102 208L106 201L110 210L94 212ZM146 202L150 210L154 201L158 208L162 200L166 208L150 214Z" />
    </svg>
  );
}
