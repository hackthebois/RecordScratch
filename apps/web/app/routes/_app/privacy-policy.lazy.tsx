import { Head } from "@/components/Head";
import { ErrorComponent } from "@/components/router/ErrorComponent";
import { PendingComponent } from "@/components/router/Pending";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_app/privacy-policy")({
	component: PrivacyPolicy,
	pendingComponent: PendingComponent,
	errorComponent: ErrorComponent,
});

function PrivacyPolicy() {
	return (
		<div className="mx-auto p-4 md:p-8">
			<h1 className="mb-4 text-5xl font-bold">Privacy Policy</h1>
			<p className="mb-4">
				By accessing and using recordscratch.app and any RecordScratch
				services, you acknowledge that you have read, understood, and
				agree to comply with the following privacy policy. If you do not
				agree with this policy, please refrain from using our service.
			</p>

			<div className="space-y-6">
				<section>
					<h1 className="mb-2 text-3xl font-semibold">
						Information We Collect
					</h1>
					<p>
						We only collect personal information that is voluntarily
						provided by you. We collect the following information:
					</p>
					<ul className="list-disc pl-6">
						<li>Email address</li>
						<li>Username</li>
						<li>
							Usage data (e.g., pages visited, time spent on the
							site)
						</li>
					</ul>
				</section>

				<section>
					<h1 className="mb-2 text-3xl font-semibold">
						Use of Your Information
					</h1>
					<p>
						The information we collect is used for the following
						purposes:
					</p>
					<ul className="list-disc pl-6">
						<li>To provide and maintain our services</li>
						<li>To notify you about changes to our services</li>
						<li>
							To allow you to participate in interactive features
							of our services
						</li>
						<li>To provide customer support</li>
						<li>
							To gather analysis or valuable information so that
							we can improve our services
						</li>
						<li>To monitor the usage of our services</li>
					</ul>
				</section>

				<section>
					<h1 className="mb-2 text-3xl font-semibold">
						Disclosure of Your Information
					</h1>
					<p>
						We may disclose your personal information in certain
						situations, such as:
					</p>
					<ul className="list-disc pl-6">
						<li>To comply with legal obligations</li>
						<li>To protect and defend our rights or property</li>
						<li>
							To prevent or investigate possible wrongdoing in
							connection with our services
						</li>
						<li>
							To protect the personal safety of users of our
							services or the public
						</li>
					</ul>
				</section>

				<section>
					<h1 className="mb-2 text-3xl font-semibold">
						Security of Your Information
					</h1>
					<p>
						We take the security of your information seriously and
						use appropriate technical and organizational measures to
						protect it. However, please be aware that no method of
						transmission over the internet or electronic storage is
						100% secure, and we cannot guarantee the absolute
						security of your information.
					</p>
				</section>

				<section>
					<h1 className="mb-2 text-3xl font-semibold">
						Changes to This Privacy Policy
					</h1>
					<p>
						We may update our Privacy Policy from time to time. We
						will notify you of any changes by posting the new
						Privacy Policy on this page. You are advised to review
						this Privacy Policy periodically for any changes.
					</p>
				</section>

				<section>
					<h1 className="mb-2 text-3xl font-semibold">Contact Us</h1>
					<p>
						If you have any questions or concerns about this Privacy
						Policy, please contact us at{" "}
						<a href="mailto:contact@recordscratch.com">
							recordscratchapp@gmail.com
						</a>
						.
					</p>
				</section>
			</div>
		</div>
	);
}
