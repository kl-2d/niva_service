---
trigger: always_on
---

---

description: Apply to all interactions to enforce PowerShell as the default terminal
glob: "*"
---

# PowerShell Terminal Rules

- You are operating in a Windows environment.
- The default terminal is strictly **PowerShell**.
- All terminal commands, scripts, and actions must be generated and executed using PowerShell syntax (e.g., using `$env:VAR` instead of `export VAR`).
- Ensure all commands are formatted to work correctly in PowerShell and expect the `PS C:\...>` prompt.
- NEVER use Bash, sh, or standard cmd.exe commands if they conflict with PowerShell.
