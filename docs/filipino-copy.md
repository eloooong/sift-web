# Filipino copy

Write for someone checking a worrying message on their phone. Be calm, direct, and helpful. Write the idea in Filipino first, rather than translating an English sentence word for word.

- Address the reader as **mo** or **ka**. Use short sentences and specific actions.
- Keep familiar terms: **OTP, PIN, password, account, link, app, screenshot**.
- Prefer **mensahe**, **bayad**, **nagpadala**, and **palatandaan** in explanations.
- Use **raw** or **daw** for claims the sender makes. A warning sign is not proof of fraud.
- Avoid forced slang, literal idioms such as “pulang bandila,” and internal jargon such as “rule-engine cross-check.”
- Preserve quoted evidence exactly, including its original language, spelling, amounts, and addresses.

| Context | Wording |
| --- | --- |
| Main action | I-check ang mensahe |
| Findings | Mga kahina-hinalang palatandaan |
| Next steps | Ano ang puwede mong gawin? |
| Address details | Mga bahagi ng link |
| AI result | Sinuri ng AI |
| Rules-only result | Sinuri nang walang AI |

Keep both dictionaries in `src/lib/i18n/dictionary.ts` complete. Localize rule explanations, recommendations, sample descriptions, and AI instructions as well as labels. Screenshot and link requests must carry the selected language. Test the full journey at mobile and desktop widths, including loading, errors, and results.
