import { Discord } from "@/components/icons/Discord";
import { Seo } from "@/components/Seo";
import { Button } from "@/components/ui/Button";
import { socials } from "@recordscratch/lib";
import { createLazyFileRoute } from "@tanstack/react-router";
import { Mail } from "lucide-react";

export const Route = createLazyFileRoute("/_app/support")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="mx-auto p-4 md:p-8">
			<Seo
				title="Support"
				description="Get help and support for RecordScratch"
			/>
			<h1 className="mb-4 text-5xl font-bold">Support</h1>
			<p className="mb-8 text-muted-foreground">
				Need help with RecordScratch? We're here to assist you. Choose
				your preferred method of contact below.
			</p>

			<div className="space-y-8">
				<section>
					<h2 className="mb-4 text-3xl font-semibold">
						Discord Community
					</h2>
					<p className="mb-4">Join our Discord community for:</p>
					<ul className="mb-4 list-disc pl-6 text-muted-foreground">
						<li>Real-time support from our team and community</li>
						<li>Feature discussions and suggestions</li>
						<li>Bug reports</li>
						<li>Connect with fellow music lovers</li>
					</ul>
					<a
						href={socials.discord}
						target="_blank"
						rel="noopener noreferrer"
					>
						<Button variant="outline" className="gap-2">
							<Discord size={20} />
							Join our Discord
						</Button>
					</a>
				</section>
				<section>
					<h2 className="mb-4 text-3xl font-semibold">
						Email Support
					</h2>
					<p className="mb-4">
						For other inquiries, you can reach us via email. We
						typically respond within 24-48 hours.
					</p>
					<a href={"mailto:" + socials.email}>
						<Button variant="outline" className="gap-2">
							<Mail size={20} />
							Send us an Email
						</Button>
					</a>
					<p className="mt-2 text-sm text-muted-foreground">
						Alternatively, copy our email address:{" "}
						<span className="font-mono">{socials.email}</span>
					</p>
				</section>
			</div>
		</div>
	);
}
