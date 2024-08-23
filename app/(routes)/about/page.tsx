import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  Lock,
  Globe,
  Calculator,
  User,
  Share2,
  LucideIcon
} from "lucide-react"
import { ReactNode } from "react"

const BackButton = () => (
  <Link href="/" className="m-2 mb-4 inline-block">
    <Button variant="link">
      <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
    </Button>
  </Link>
)

const Section = ({
  title,
  children
}: {
  title: string
  children: ReactNode
}) => (
  <section>
    <h2 className="mb-2 text-xl font-semibold">{title}</h2>
    {children}
  </section>
)

const FeatureItem = ({
  icon: Icon,
  title,
  description
}: {
  icon: LucideIcon
  title: string
  description: ReactNode
}) => (
  <div className="ml-2 flex items-center space-x-1">
    <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
    <div>
      <h3 className="font-semibold">{title}</h3>
      <p>{description}</p>
    </div>
  </div>
)

export default function AboutPage() {
  return (
    <main className="mx-auto mt-5 max-w-3xl">
      <BackButton />

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">About TabSplit</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Section title="How TabSplit Works">
            <p>
              TabSplit is a simple, user-friendly tool that helps you split
              bills with friends without any fuss. Here&apos;s how easy it is:
            </p>
            <ul className="mt-1 list-inside list-disc space-y-2 pl-4">
              <li>
                Just enter what you bought, how much it cost, and who&apos;s
                paying for each item.
              </li>
              <li>TabSplit does the math for you, including tax and tip.</li>
              <li>See exactly who owes what, down to the last cent.</li>
              <li>Share the results with your friends using a simple link.</li>
            </ul>
          </Section>

          <Section title="Your Data Stays With You">
            <p className="mb-4">
              We take your privacy seriously. TabSplit is designed to be 100%
              secure and private:
            </p>
            <div className="space-y-4">
              <FeatureItem
                icon={Lock}
                title="No Data Storage, Period"
                description="TabSplit doesn't have a database. We don't store any of your information anywhere. Everything happens right in your browser."
              />
              <FeatureItem
                icon={Share2}
                title="Magic Links"
                description="When you share your split, all the information is contained in the link itself. No data is sent to or stored on our servers."
              />
              <FeatureItem
                icon={Calculator}
                title="Calculations You Can Trust"
                description="All the math happens on your device. You can always double-check our work!"
              />
              <FeatureItem
                icon={Globe}
                title="Works Offline"
                description="Once the page is loaded, TabSplit works without an internet connection. Your data never leaves your device."
              />
            </div>
          </Section>

          <Section title="Who Made This?">
            <FeatureItem
              icon={User}
              title=""
              description={
                <>
                  TabSplit was created by{" "}
                  <a
                    href="https://saharsh.xyz?ref=tabsplit"
                    className="text-link text-muted-foreground"
                    target="_blank"
                    rel="noopener"
                  >
                    @saharshxyz
                  </a>
                  . If you have any questions or feedback, feel free to reach
                  out!
                </>
              }
            />
          </Section>
        </CardContent>
      </Card>
    </main>
  )
}
