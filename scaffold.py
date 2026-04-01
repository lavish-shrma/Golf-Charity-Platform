import os
import re
from pathlib import Path

files_list = """
src/app/(public)/layout.js
src/app/(public)/page.js
src/app/(public)/how-it-works/page.js
src/app/(public)/charities/page.js
src/app/(public)/charities/[slug]/page.js
src/app/(public)/prizes/page.js
src/app/(auth)/layout.js
src/app/(auth)/login/page.js
src/app/(auth)/signup/page.js
src/app/(auth)/forgot-password/page.js
src/app/(auth)/reset-password/page.js
src/app/(dashboard)/layout.js
src/app/(dashboard)/loading.js
src/app/(dashboard)/dashboard/page.js
src/app/(dashboard)/scores/page.js
src/app/(dashboard)/my-charity/page.js
src/app/(dashboard)/draws/page.js
src/app/(dashboard)/draws/[id]/page.js
src/app/(dashboard)/winnings/page.js
src/app/(dashboard)/settings/page.js
src/app/(admin)/layout.js
src/app/(admin)/loading.js
src/app/(admin)/admin/page.js
src/app/(admin)/admin/users/page.js
src/app/(admin)/admin/users/[id]/page.js
src/app/(admin)/admin/draws/page.js
src/app/(admin)/admin/charities/page.js
src/app/(admin)/admin/charities/[id]/page.js
src/app/(admin)/admin/winners/page.js
src/app/(admin)/admin/prize-pool/page.js
src/app/(admin)/admin/audit-log/page.js
src/app/api/auth/signup/route.js
src/app/api/auth/login/route.js
src/app/api/auth/logout/route.js
src/app/api/auth/me/route.js
src/app/api/auth/forgot-password/route.js
src/app/api/auth/reset-password/route.js
src/app/api/subscriptions/checkout/route.js
src/app/api/subscriptions/status/route.js
src/app/api/subscriptions/cancel/route.js
src/app/api/subscriptions/reactivate/route.js
src/app/api/subscriptions/portal/route.js
src/app/api/webhooks/stripe/route.js
src/app/api/donate/route.js
src/app/api/scores/route.js
src/app/api/scores/[id]/route.js
src/app/api/draws/route.js
src/app/api/draws/current/route.js
src/app/api/draws/[id]/route.js
src/app/api/prize-pool/current/route.js
src/app/api/prize-pool/history/route.js
src/app/api/charities/route.js
src/app/api/charities/featured/route.js
src/app/api/charities/[slug]/route.js
src/app/api/user/charity/route.js
src/app/api/winners/my-prizes/route.js
src/app/api/winners/verify/[prizeId]/route.js
src/app/api/dashboard/summary/route.js
src/app/api/dashboard/participation/route.js
src/app/api/admin/users/route.js
src/app/api/admin/users/[id]/route.js
src/app/api/admin/draws/simulate/route.js
src/app/api/admin/draws/execute/route.js
src/app/api/admin/draws/config/route.js
src/app/api/admin/draws/[id]/publish/route.js
src/app/api/admin/charities/route.js
src/app/api/admin/charities/[id]/route.js
src/app/api/admin/charities/[id]/events/route.js
src/app/api/admin/charities/[id]/events/[eventId]/route.js
src/app/api/admin/winners/route.js
src/app/api/admin/winners/[id]/review/route.js
src/app/api/admin/winners/[id]/payout/route.js
src/app/api/admin/prize-pool/ledger/route.js
src/app/api/admin/prize-pool/calculate/route.js
src/app/api/admin/analytics/route.js
src/app/api/admin/audit-log/route.js
src/lib/stripe/client.js
src/lib/stripe/webhooks.js
src/lib/draw-engine/random.js
src/lib/draw-engine/weighted.js
src/lib/draw-engine/matcher.js
src/lib/draw-engine/index.js
src/lib/prize-pool/calculator.js
src/lib/prize-pool/rollover.js
src/lib/prize-pool/index.js
src/lib/email/client.js
src/lib/email/templates.js
src/lib/validators/scores.js
src/lib/validators/charity.js
src/lib/validators/draws.js
src/lib/validators/common.js
src/lib/constants.js
src/lib/config.js
src/lib/auth.js
src/lib/errors.js
src/lib/utils.js
src/components/layout/Navbar.jsx
src/components/layout/Footer.jsx
src/components/layout/DashboardSidebar.jsx
src/components/layout/AdminSidebar.jsx
src/components/layout/MobileNav.jsx
src/components/auth/LoginForm.jsx
src/components/auth/SignupForm.jsx
src/components/auth/ForgotPasswordForm.jsx
src/components/auth/AuthGuard.jsx
src/components/scores/ScoreEntryForm.jsx
src/components/scores/ScoreCard.jsx
src/components/scores/RollingScoresDisplay.jsx
src/components/draws/DrawResultCard.jsx
src/components/draws/MatchDisplay.jsx
src/components/draws/PrizePoolBreakdown.jsx
src/components/draws/DrawCountdown.jsx
src/components/charity/CharityCard.jsx
src/components/charity/CharitySelector.jsx
src/components/charity/ContributionSlider.jsx
src/components/charity/FeaturedCharity.jsx
src/components/charity/CharityEvents.jsx
src/components/winners/PrizeCard.jsx
src/components/winners/VerificationUpload.jsx
src/components/admin/UserTable.jsx
src/components/admin/DrawConfigPanel.jsx
src/components/admin/SimulationResults.jsx
src/components/admin/CharityForm.jsx
src/components/admin/WinnerReviewCard.jsx
src/components/admin/LedgerTable.jsx
src/components/admin/AnalyticsCards.jsx
src/components/admin/AuditLogTable.jsx
src/components/shared/LoadingSpinner.jsx
src/components/shared/EmptyState.jsx
src/components/shared/ErrorBoundary.jsx
src/components/shared/ConfirmDialog.jsx
src/components/shared/CurrencyDisplay.jsx
src/components/shared/StatusBadge.jsx
src/hooks/useAuth.js
src/hooks/useSubscription.js
src/hooks/useScores.js
src/hooks/useDraws.js
src/context/AuthProvider.jsx
src/context/ToastProvider.jsx
"""

for file_path in files_list.strip().split('\n'):
    path = Path(file_path.strip())
    path.parent.mkdir(parents=True, exist_ok=True)
    
    # If the file already exists (with substantial content > 100 bytes), skip to avoid overwriting user edits
    if path.exists() and path.stat().st_size > 100:
        continue
        
    content = ""
    name = path.name
    
    # Each route.js file should export a GET or POST function that returns a Response.json with a message saying not implemented yet. 
    if name == 'route.js':
        content = """import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({ message: 'Not implemented yet' }, { status: 501 });
}

export async function POST() {
    return NextResponse.json({ message: 'Not implemented yet' }, { status: 501 });
}
"""
    # Each page file should export a default function with the file name as the component name and just return a div with the page name as text as a placeholder.
    elif name == 'page.js' or path.suffix == '.jsx':
        # Default component name Generation
        # if path is src/app/(public)/how-it-works/page.js -> HowItWorksPage
        # if path is src/components/layout/Navbar.jsx -> Navbar
        if name == 'page.js' or name == 'layout.js' or name == 'loading.js':
            base = path.parent.name
            # sanitize parent name stripping route groups or brackets
            base = re.sub(r'[()\[\]]', '', base).capitalize()
            # If it's a dynamic route like '[id]' -> 'Id'
            if not base or base == 'App':
                base = 'Home'
            comp_name = base.replace('-', ' ').title().replace(' ', '')
            
            if name == 'page.js':
                comp_name += "Page"
            elif name == 'layout.js':
                comp_name += "Layout"
            elif name == 'loading.js':
                comp_name += "Loading"
                
            display = f"{base} {name.replace('.js', '').capitalize()}"
        else:
            comp_name = path.stem.replace('-', ' ').title().replace(' ', '')
            display = comp_name

        content = f"""export default function {comp_name}() {{
  return (
    <div>
      {display}
    </div>
  );
}}
"""
        
        # For layouts, we need to export default function with "children" prop
        if name == 'layout.js':
            content = f"""export default function {comp_name}({{ children }}) {{
  return (
    <div>
      {display}
      {{children}}
    </div>
  );
}}
"""
    # Each lib file should be empty with just a comment saying the file name and purpose.
    else:
        # Check if it's a js file in lib, hooks, context
        content = f"// {name}\n// Placeholder for {path.parent.name} functionality\n"

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

print("Scaffolded component files exactly to specifications.")
