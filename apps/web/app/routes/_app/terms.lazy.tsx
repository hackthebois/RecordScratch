import { ErrorComponent } from "@/components/router/ErrorComponent";
import { PendingComponent } from "@/components/router/Pending";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_app/terms")({
	component: TermsAndConditions,
	pendingComponent: PendingComponent,
	errorComponent: ErrorComponent,
});

function TermsAndConditions() {
	return (
		<div className="mx-auto p-4 md:p-8">
			{/* <Seo title="Terms and Conditions" /> */}
			<h1 className="mb-4 text-5xl font-bold">
				Terms and Conditions of Use
			</h1>
			<p className="mb-4">
				By accessing and using{" "}
				<a
					href="https://recordscratch.app"
					className="text-blue-300 underline"
				>
					recordscratch.app
				</a>{" "}
				and any RecordScratch services, you acknowledge that you have
				read, understood, and agree to comply with the following terms
				and conditions. If you do not agree with these terms, please
				refrain from using our service.
			</p>

			<div className="space-y-6">
				<section>
					<h1 className="mb-2 text-3xl font-semibold">Use</h1>
					<p>
						You may only use RecordScratch in accordance with these
						Terms. All rights not expressly granted to you in these
						Terms are reserved by us.
					</p>
				</section>

				<section>
					<h1 className="mb-2 text-3xl font-semibold">
						Responsibility
					</h1>
					<p>
						You will be responsible for all activity that occurs as
						a result of your use of RecordScratch. We disclaim any
						and all liability (including for negligence) for the
						content, opinions, statements or other information
						posted to, or use of, RecordScratch by its users.
					</p>
				</section>

				<section>
					<h1 className="mb-2 text-3xl font-semibold">
						Community Policy
					</h1>
					<p>
						You must be courteous and respectful of others’
						opinions, and you must not post unwelcome, aggressive,
						suggestive or otherwise inappropriate remarks directed
						at another member of RecordScratch.
					</p>
				</section>

				<section>
					<h1 className="mb-2 text-3xl font-semibold">
						No Malicious Use
					</h1>
					<p>
						You agree to access RecordScratch through the interface
						we provide. You must not use RecordScratch for any
						malicious means, or abuse, harass, threaten, intimidate
						or impersonate any other user of the Service or any
						RecordScratch employee.
					</p>
				</section>

				<section>
					<h1 className="mb-2 text-3xl font-semibold">
						No Illegal Use
					</h1>
					<p>
						You must not use RecordScratch for any unlawful purpose,
						or post any information that is in breach of any
						confidentiality obligation, copyright, trade mark or
						other intellectual property or proprietary rights of any
						person.
					</p>
				</section>

				<section>
					<h1 className="mb-2 text-3xl font-semibold">
						Removal of Content
					</h1>
					<p>
						We reserve the right to remove any content posted to
						RecordScratch that we consider (in our absolute
						discretion) to be offensive, objectionable, unlawful,
						explicit, graphic or otherwise in breach of these Terms.
					</p>
				</section>

				<section>
					<h1 className="mb-2 text-3xl font-semibold">
						Intellectual Property
					</h1>
					<p>
						You agree that we own all of the intellectual property
						rights on RecordScratch. Any content you post to
						RecordScratch should be original and must not infringe
						anyone else's intellectual property rights.
					</p>
				</section>

				<section>
					<h1 className="mb-2 text-3xl font-semibold">
						Prohibited Actions
					</h1>
					<p>
						Users may not steal, copy, reproduce, or otherwise
						unauthorizedly access any belonging to any users or
						RecordScratch.
					</p>
				</section>

				<section>
					<h1 className="mb-2 text-3xl font-semibold">Amendments</h1>
					<p>
						We reserve the right to amend these Terms at any time
						and may add new features that will be subject to these
						Terms.
					</p>
				</section>

				<section>
					<h1 className="mb-2 text-3xl font-semibold">
						Termination or Suspension of Accounts
					</h1>
					<p>
						If you do not abide by these Terms, we may suspend or
						terminate your account.
					</p>
				</section>

				<section>
					<h1 className="mb-2 text-3xl font-semibold">
						Governing Law and Jurisdiction
					</h1>
					<p>
						All users of the Service agree that the laws of Canada
						shall govern and apply to these Terms and each user’s
						use of the Service, and all users submit to the
						exclusive jurisdiction of the Canadian courts for any
						matter or dispute arising in relation to these Terms.
					</p>
				</section>
			</div>
		</div>
	);
}
