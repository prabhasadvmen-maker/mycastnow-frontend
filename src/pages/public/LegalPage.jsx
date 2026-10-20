import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, Mail, ShieldCheck } from 'lucide-react';
import PublicLayout from '../../components/public/PublicLayout';

const LAST_UPDATED = '20 October 2026';
const CONTACT_EMAIL = 'info@mycastnow.com';

const DOCS = {
  terms: {
    icon: FileText,
    eyebrow: 'Legal',
    title: 'Terms of Service',
    pageTitle: 'Terms of Service | MyCastNow',
    intro:
      'These Terms govern your access to and use of MyCastNow, a platform that connects creators — models, actors, influencers and other talent — with production houses, brands and casting teams. Please read them carefully.',
    sections: [
      {
        h: 'Acceptance of these Terms',
        p: [
          'By creating an account, logging in or otherwise using MyCastNow (the "Platform"), you agree to be bound by these Terms and our Privacy Policy. If you do not agree, please do not use the Platform.',
          'You must be at least 18 years old, or have the verifiable consent of a parent or legal guardian, to use the Platform.',
        ],
      },
      {
        h: 'Your account',
        p: ['Accounts are created and accessed using your mobile number and a one-time password (OTP). You are responsible for:'],
        list: [
          'Providing accurate, current and complete information in your profile.',
          'Keeping your phone number and OTPs confidential. MyCastNow will never ask you to share an OTP with anyone.',
          'All activity that takes place through your account.',
          'Telling us immediately if you suspect unauthorised access.',
        ],
      },
      {
        h: 'Creator profiles and portfolio content',
        p: [
          'You retain ownership of the photos, videos and other material you upload ("Your Content"). By uploading it, you grant MyCastNow a non-exclusive, worldwide, royalty-free licence to host, display and promote Your Content on the Platform so that companies can discover you.',
        ],
        list: [
          'Upload only content you own or are authorised to use.',
          'Do not upload content that is unlawful, obscene, misleading, defamatory or that infringes anyone’s rights.',
          'Do not impersonate another person or misrepresent your age, experience, appearance or credentials.',
          'We may review, remove or restrict content or profiles that breach these Terms.',
        ],
      },
      {
        h: 'Castings, applications and bookings',
        p: [
          'MyCastNow is a marketplace. We provide the tools for creators and companies to find each other, communicate and agree on work; the engagement itself is a contract between the creator and the company.',
        ],
        list: [
          'Applying to a casting does not guarantee a booking or any payment.',
          'Companies are responsible for the accuracy of their casting calls, the terms offered and the lawful conduct of their shoots.',
          'MyCastNow is not an employer or agent of any creator or company and does not guarantee the quality, safety or legality of any engagement.',
          'Keep project scope, schedule and payment terms documented on the Platform.',
        ],
      },
      {
        h: 'Subscriptions, fees and payments',
        p: [
          'Some features require a paid subscription or the purchase of add-ons such as profile boosts. Prices, billing cycles and inclusions are shown at checkout and on the Pricing page and may change with prior notice for future billing periods.',
          'Payments are processed by third-party payment partners. Unless stated otherwise at purchase or required by law, fees are non-refundable once a plan period has started or a service has been delivered. Coupons and promotional offers are subject to their stated conditions and may be withdrawn if misused.',
        ],
      },
      {
        h: 'Prohibited conduct',
        p: ['You agree not to:'],
        list: [
          'Ask for or send money, OTPs, passwords or sensitive identity documents outside the Platform’s intended flows.',
          'Harass, threaten, discriminate against or exploit other users, or post sexually explicit content.',
          'Scrape, copy or resell Platform data, or use bots or automated tools without our written permission.',
          'Interfere with the security or operation of the Platform, or attempt to access accounts or data that are not yours.',
          'Use the Platform for any unlawful purpose or in breach of applicable Indian law.',
        ],
      },
      {
        h: 'Safety and reporting',
        p: [
          'Meet new collaborators carefully, prefer public or professional locations, and keep communication on the Platform where possible. If something feels wrong, report it to us at ' +
            CONTACT_EMAIL +
            '. We may investigate and take action, including suspending accounts and cooperating with law enforcement.',
        ],
      },
      {
        h: 'Intellectual property',
        p: [
          'The MyCastNow name, logo, software, design and all Platform content (other than Your Content and content provided by other users) belong to MyCastNow or its licensors and are protected by law. You may not copy, modify or exploit them without our written consent.',
        ],
      },
      {
        h: 'Suspension and termination',
        p: [
          'You may stop using the Platform and request deletion of your account at any time. We may suspend or terminate access, with or without notice, if we reasonably believe you have breached these Terms, created risk or legal exposure, or misused the Platform. Provisions that by their nature should survive termination will continue to apply.',
        ],
      },
      {
        h: 'Disclaimers and limitation of liability',
        p: [
          'The Platform is provided on an "as is" and "as available" basis. To the fullest extent permitted by law, MyCastNow does not warrant that the Platform will be uninterrupted or error-free, or that any casting, booking or payment between users will be successful.',
          'To the extent permitted by law, MyCastNow will not be liable for indirect, incidental or consequential losses, or for disputes between users. Our total liability for any claim relating to the Platform is limited to the amount you paid to MyCastNow in the 12 months before the claim arose.',
        ],
      },
      {
        h: 'Changes to these Terms',
        p: [
          'We may update these Terms from time to time. When we make material changes we will update the date at the top of this page and, where appropriate, notify you. Continuing to use the Platform after changes take effect means you accept them.',
        ],
      },
      {
        h: 'Governing law and disputes',
        p: [
          'These Terms are governed by the laws of India. Subject to any mandatory consumer rights, the courts at the location of MyCastNow’s registered office will have exclusive jurisdiction. We encourage you to contact us first so we can try to resolve any concern informally.',
        ],
      },
      {
        h: 'Contact us',
        p: ['Questions about these Terms? Email us at ' + CONTACT_EMAIL + '.'],
      },
    ],
  },

  privacy: {
    icon: ShieldCheck,
    eyebrow: 'Legal',
    title: 'Privacy Policy',
    pageTitle: 'Privacy Policy | MyCastNow',
    intro:
      'Your privacy matters to us. This policy explains what personal information MyCastNow collects, why we collect it, how it is used and shared, and the choices and rights you have.',
    sections: [
      {
        h: 'Information we collect',
        p: ['Depending on how you use the Platform, we may collect:'],
        list: [
          'Account details — your mobile number, name, email address and login (OTP) activity.',
          'Profile and portfolio information — photos, videos, bio, city, languages, skills, experience, physical attributes you choose to add (such as height), pricing and availability.',
          'Activity data — castings you view or apply to, bookings, messages, reviews and support requests.',
          'Payment information — subscription and transaction records. Card and UPI details are handled by our payment partners and are not stored by us.',
          'Technical data — device and browser type, IP address, pages visited and approximate location, collected through cookies and similar technologies.',
        ],
      },
      {
        h: 'How we use your information',
        list: [
          'To create and secure your account and verify you with OTPs.',
          'To build your creator profile and make it discoverable to companies and casting teams.',
          'To match you with relevant castings and enable messaging and bookings.',
          'To process payments, subscriptions, boosts and coupons.',
          'To send service notifications, security alerts and, where permitted, updates about features and offers.',
          'To prevent fraud and abuse, enforce our Terms, and comply with legal obligations.',
          'To maintain and improve the Platform.',
        ],
      },
      {
        h: 'What is visible to others',
        p: [
          'An approved creator profile — including your name, photos, category, city and the portfolio details you add — can be seen by visitors and by registered companies. Your mobile number is not shown publicly. Contact and booking details are shared only as needed to complete an engagement you have agreed to. You can manage what you share from your profile and privacy settings.',
        ],
      },
      {
        h: 'How we share information',
        p: ['We do not sell your personal information. We share it only:'],
        list: [
          'With companies and other users, as described above.',
          'With service providers that help us run the Platform — such as cloud hosting and file storage, SMS/OTP delivery, payment processing and analytics — who may use it only to provide services to us.',
          'When required by law, court order or a government authority, or to protect the rights, safety and property of users and MyCastNow.',
          'In connection with a merger, acquisition or sale of assets, with notice to you where required.',
        ],
      },
      {
        h: 'Cookies and similar technologies',
        p: [
          'We use cookies and local storage to keep you signed in, remember preferences and understand how the Platform is used. You can control cookies through your browser settings, although some features may not work properly if they are disabled.',
        ],
      },
      {
        h: 'Data retention',
        p: [
          'We keep your information for as long as your account is active and as needed to provide the Platform. After you delete your account we remove or anonymise your personal information within a reasonable period, except where we must retain certain records — for example transaction records, or data needed to resolve disputes and meet legal obligations.',
        ],
      },
      {
        h: 'Security',
        p: [
          'We use reasonable technical and organisational safeguards, including encrypted connections, access controls and rate limiting on sign-in. No system is completely secure, so please protect your phone and never share your OTP. If you notice suspicious activity on your account, contact us immediately.',
        ],
      },
      {
        h: 'Your rights and choices',
        p: ['Subject to applicable law, including India’s Digital Personal Data Protection Act, 2023, you may:'],
        list: [
          'Access and update the information in your profile at any time.',
          'Ask us to correct inaccurate information or delete your account and data.',
          'Withdraw consent for optional uses, such as marketing messages.',
          'Raise a grievance with us about how your data is handled.',
        ],
      },
      {
        h: 'Children',
        p: [
          'The Platform is intended for adults. Profiles for minors may be created only by a parent or legal guardian who provides consent and manages the account. If you believe a child’s information has been provided without proper consent, contact us and we will take appropriate steps.',
        ],
      },
      {
        h: 'Changes to this policy',
        p: [
          'We may update this policy as our Platform or the law changes. The date at the top shows when it was last revised, and we will notify you of material changes where appropriate.',
        ],
      },
      {
        h: 'Contact and grievances',
        p: [
          'For privacy questions, data requests or complaints, write to us at ' +
            CONTACT_EMAIL +
            '. We aim to respond within a reasonable time.',
        ],
      },
    ],
  },
};

const slug = (t) => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export default function LegalPage({ doc = 'terms' }) {
  const data = DOCS[doc] || DOCS.terms;
  const Icon = data.icon;
  const other = doc === 'terms' ? { to: '/privacy', label: 'Privacy Policy' } : { to: '/terms', label: 'Terms of Service' };
  const [active, setActive] = useState(slug(data.sections[0].h));

  // highlight the section currently in view in the table of contents
  useEffect(() => {
    const els = data.sections.map((s) => document.getElementById(slug(s.h))).filter(Boolean);
    if (!('IntersectionObserver' in window) || !els.length) return undefined;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-90px 0px -65% 0px' }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [data]);

  return (
    <PublicLayout title={data.pageTitle}>
      <section className="bg-[linear-gradient(135deg,#eaf4ff_0%,#c4defc_55%,#a9cdf8_100%)] py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-5">
          <Link to="/creator/login" className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 hover:text-blue-800">
            <ArrowLeft size={16} /> Back to login
          </Link>
          <div className="mt-5 flex items-start gap-4">
            <div className="hidden sm:flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-md shadow-blue-900/10">
              <Icon size={27} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[.2em] text-blue-600">{data.eyebrow}</p>
              <h1 className="mt-1.5 text-3xl font-black tracking-tight text-blue-950 sm:text-5xl">{data.title}</h1>
              <p className="mt-3 text-sm font-medium text-slate-600">Last updated: {LAST_UPDATED}</p>
            </div>
          </div>
          <p className="mt-6 max-w-3xl text-base leading-relaxed text-slate-700">{data.intro}</p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-5 py-10 sm:py-14 lg:grid lg:grid-cols-[230px_1fr] lg:gap-12">
        {/* Table of contents */}
        <aside className="hidden lg:block">
          <nav aria-label="On this page" className="sticky top-24">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">On this page</p>
            <ul className="mt-3 space-y-1 border-l border-slate-200">
              {data.sections.map((s, i) => {
                const id = slug(s.h);
                const on = active === id;
                return (
                  <li key={id}>
                    <a
                      href={`#${id}`}
                      className={`-ml-px block border-l-2 py-1.5 pl-3 text-[13px] leading-snug transition-colors ${
                        on ? 'border-blue-600 font-semibold text-blue-700' : 'border-transparent text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {i + 1}. {s.h}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        {/* Content */}
        <article className="min-w-0">
          {data.sections.map((s, i) => (
            <section key={s.h} id={slug(s.h)} className="scroll-mt-24 border-b border-slate-200 py-7 first:pt-0 last:border-0">
              <h2 className="text-xl font-extrabold text-blue-950 sm:text-2xl">
                <span className="mr-2 text-blue-500">{i + 1}.</span>
                {s.h}
              </h2>
              {s.p?.map((para) => (
                <p key={para} className="mt-3 text-[15px] leading-7 text-slate-600">{para}</p>
              ))}
              {s.list && (
                <ul className="mt-3 space-y-2">
                  {s.list.map((item) => (
                    <li key={item} className="flex gap-3 text-[15px] leading-7 text-slate-600">
                      <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}

          <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-blue-100 bg-blue-50/70 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3 text-sm text-slate-700">
              <Mail size={20} className="shrink-0 text-blue-600" />
              <span>
                Questions? Write to <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-blue-700 hover:underline">{CONTACT_EMAIL}</a>
              </span>
            </div>
            <Link to={other.to} className="text-sm font-semibold text-blue-700 hover:underline">
              Read our {other.label} →
            </Link>
          </div>
        </article>
      </div>
    </PublicLayout>
  );
}
