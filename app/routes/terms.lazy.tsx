import { createLazyFileRoute } from "@tanstack/react-router";

const Terms = () => {
	return (
		<div className="flex flex-col gap-6">
			<h1>Terms and conditions of use</h1>
			<p>
				By accessing and using recordscratch.app and any RecordScratch services, you
				acknowledge that you have read, understood, and agree to comply with the following
				terms and conditions. If you do not agree with these terms, please refrain from
				using our service.
			</p>
			<ol className="flex list-decimal flex-col gap-2 pl-8">
				<li>
					Use: You may only use RecordScratch in accordance with these Terms. All rights
					not expressly granted to you in these Terms are reserved by us.
				</li>
				<li>
					Use: You may only use RecordScratch in accordance with these Terms. All rights
					not expressly granted to you in these Terms are reserved by us.
				</li>
				<li>
					Responsibility: You will be responsible for all activity that occurs as a result
					of your use of RecordScratch. We disclaim any and all liability (including for
					negligence) for the content, opinions, statements or other information posted
					to, or use of, RecordScratch by its users.
				</li>
				<li>
					Community policy: You must be courteous and respectful of others’ opinions, and
					you must not post unwelcome, aggressive, suggestive or otherwise inappropriate
					remarks directed at another member of RecordScratch.
				</li>
				<li>
					No malicious use: You agree to access RecordScratch through the interface we
					provide. You must not use RecordScratch for any malicious means, or abuse,
					harass, threaten, intimidate or impersonate any other user of the Service or any
					RecordScratch employee. You must not request or attempt to solicit personal or
					identifying information from another member of RecordScratch. You must not
					mislead RecordScratch’s support or moderation representatives, such as by making
					false or malicious reports about other members or their content, or by sending
					(or encouraging others to send) multiple reports regarding the same content or
					issue. Such behaviours may result in action being taken on your account.
				</li>
				<li>
					No illegal use: You must not use RecordScratch for any unlawful purpose, or post
					any information that is in breach of any confidentiality obligation, copyright,
					trade mark or other intellectual property or proprietary rights of any person.
				</li>
				<li>
					Removal of content: We reserve the right to remove any content posted to
					RecordScratch that we consider (in our absolute discretion) to be offensive,
					objectionable, unlawful, explicit, graphic or otherwise in breach of these
					Terms, including content that expressly (or implicitly, through coded language,
					symbol, keywords or tags) praises, supports, promotes or represents
					white-nationalist or neighboring ideologies. We reserve the right to remove any
					content posted to RecordScratch that disseminates misinformation and its related
					manipulations, including viral sloganeering.
				</li>
				<li>
					Intellectual property: You agree that we own all of the intellectual property
					rights on RecordScratch. You grant us a non-exclusive, royalty-free,
					irrevocable, perpetual and sub-licensable right to use, reproduce, distribute
					and display (including for commercial purposes) on RecordScratch and in other
					media any content or material that you post on RecordScratch, and any name(s)
					and/or avatar under which you post such content. Other than this right, we claim
					no intellectual property rights in relation to the information or content that
					you upload onto RecordScratch. Any content you post to RecordScratch should be
					original (not plagiarized from another person’s writing) and must not infringe
					anyone else’s intellectual property rights. Where you are referencing someone
					else’s intellectual property, you must make this clear by naming the quoted
					material’s author and through the use of identifiers such as quotation marks,
					links to source material, or other means.
				</li>
				<li>
					Prohibited Actions: Users may not steal, copy, reproduce, or otherwise
					unauthorizedly access any belonging to any users or RecordScratch. Any attempt
					to compromise the security of the system, access unauthorized data, or engage in
					hacking activities is strictly prohibited.{" "}
				</li>
				<li>
					Amendments: We reserve the right to amend these Terms at any time and may add
					new features that will be subject to these Terms. If these changes are material
					we will communicate the changes to users, and by continuing to use
					RecordScratch, you will be taken to have agreed to the changes.
				</li>
				<li>
					Termination or suspension of accounts: If you do not abide by these Terms, we
					may suspend or terminate your account.
				</li>
				<li>
					Technical support and malfunctions: We will try to promptly address (during
					normal business hours) all technical issues that arise on RecordScratch.
					However, we will not be liable for any loss suffered as a result of any partial
					or total breakdown of RecordScratch or any technical malfunctions.
				</li>
				<li>
					Governing law and jurisdiction: All users of the Service agree that the laws of
					Canada shall govern and apply to these Terms and each user’s use of the Service,
					and all users submit to the exclusive jurisdiction of the Canadian courts for
					any matter or dispute arising in relation to these Terms.
				</li>
			</ol>
		</div>
	);
};

export const Route = createLazyFileRoute("/terms")({
	component: Terms,
});
