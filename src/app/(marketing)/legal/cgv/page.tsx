import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Conditions Générales de Vente — ShadowReply AI',
};

export default function CgvPage() {
  return (
    <article className="prose-legal">
      <h1>Conditions Générales de Vente (CGV)</h1>
      <p className="text-foreground-muted text-sm">Dernière mise à jour : mai 2026</p>

      <h2>1. Objet et champ d&apos;application</h2>
      <p>
        Les présentes Conditions Générales de Vente (CGV) régissent les ventes de services payants
        effectuées par ShadowReply AI à ses clients (ci-après « l'Acheteur »). Elles s'appliquent
        à l'abonnement au plan Pro de ShadowReply AI.
      </p>
      <p>
        Toute commande implique l'acceptation sans réserve des présentes CGV par l'Acheteur. Les CGV
        prévalent sur tout autre document de l'Acheteur.
      </p>

      <h2>2. Identité du vendeur</h2>
      <ul>
        <li><strong>Raison sociale :</strong> ShadowReply AI</li>
        <li><strong>Email :</strong> contact@shadowreply.ai</li>
        <li><strong>Pays :</strong> France</li>
      </ul>

      <h2>3. Services proposés</h2>
      <p>
        ShadowReply AI propose un abonnement mensuel au plan « Pro » permettant l'accès à l'ensemble
        des fonctionnalités premium de la plateforme : générations illimitées, analyse complète,
        reformulateur, bibliothèque de templates étendue, statistiques avancées.
      </p>
      <p>
        Les caractéristiques précises de chaque offre sont détaillées sur la page Tarifs du site.
      </p>

      <h2>4. Prix</h2>
      <p>
        Les prix sont indiqués en euros (€) toutes taxes comprises (TTC). ShadowReply AI se réserve
        le droit de modifier ses tarifs à tout moment, les modifications s'appliquant aux abonnements
        lors de leur prochain renouvellement, après information préalable de l'Acheteur.
      </p>
      <p>
        Le prix applicable est celui en vigueur au moment de la commande, tel qu'affiché sur le site.
      </p>

      <h2>5. Commande et paiement</h2>
      <p>
        La souscription à l'abonnement Pro s'effectue en ligne via la plateforme Stripe. L'Acheteur
        reconnaît avoir vérifié l'exactitude de sa commande avant de la valider.
      </p>
      <p>
        Le paiement s'effectue par carte bancaire (Visa, Mastercard, American Express) via la
        plateforme de paiement sécurisé Stripe, certifiée PCI DSS niveau 1. ShadowReply AI ne
        stocke aucune information de carte bancaire.
      </p>
      <p>
        L'abonnement est renouvelé automatiquement chaque mois à la date anniversaire de la
        souscription, sauf résiliation avant cette date.
      </p>

      <h2>6. Activation du service</h2>
      <p>
        L'accès aux fonctionnalités Pro est activé immédiatement après confirmation du paiement par
        Stripe. L'Acheteur reçoit une confirmation par email.
      </p>

      <h2>7. Droit de rétractation</h2>
      <p>
        Conformément à l'article L221-18 du Code de la consommation, l'Acheteur dispose d'un délai
        de <strong>14 jours</strong> à compter de la souscription pour exercer son droit de
        rétractation, sans avoir à justifier de motifs ni à payer de pénalités.
      </p>
      <p>
        Toutefois, en souscrivant à l'abonnement Pro et en commençant à utiliser les fonctionnalités
        premium avant l'expiration du délai de rétractation, l'Acheteur reconnaît expressément
        renoncer à son droit de rétractation pour la période d'abonnement déjà entamée.
      </p>
      <p>
        Pour exercer ce droit, l'Acheteur doit notifier ShadowReply AI par email à{' '}
        <a href="mailto:contact@shadowreply.ai">contact@shadowreply.ai</a> avant l'expiration
        du délai.
      </p>

      <h2>8. Politique de remboursement</h2>
      <p>
        ShadowReply AI offre une garantie de satisfaction de <strong>7 jours</strong> pour tout
        premier abonnement Pro. Si l'Acheteur n'est pas satisfait dans les 7 jours suivant sa
        première souscription, il peut demander un remboursement intégral en contactant{' '}
        <a href="mailto:support@shadowreply.ai">support@shadowreply.ai</a>.
      </p>
      <p>
        En dehors de cette période, les paiements effectués ne sont pas remboursables sauf
        disposition légale contraire.
      </p>

      <h2>9. Résiliation de l&apos;abonnement</h2>
      <p>
        L'Acheteur peut résilier son abonnement à tout moment depuis ses paramètres de compte,
        rubrique « Gérer mon abonnement ». La résiliation prend effet à la fin de la période de
        facturation en cours. L'Acheteur conserve l'accès Pro jusqu'à cette date. Aucun
        remboursement au prorata n'est effectué en cas de résiliation anticipée.
      </p>

      <h2>10. Force majeure</h2>
      <p>
        ShadowReply AI ne pourra être tenu responsable de tout retard ou inexécution résultant
        d'événements indépendants de sa volonté, tels que : pannes d'infrastructure Internet,
        indisponibilité des services tiers (Stripe, fournisseurs IA), catastrophes naturelles,
        actes gouvernementaux.
      </p>

      <h2>11. Service client</h2>
      <p>
        Pour toute réclamation ou question relative à votre abonnement :{' '}
        <a href="mailto:support@shadowreply.ai">support@shadowreply.ai</a>
        <br />
        Réponse sous 24h ouvrées.
      </p>

      <h2>12. Médiation des litiges</h2>
      <p>
        En cas de litige non résolu à l'amiable, l'Acheteur peut recourir gratuitement à un
        médiateur de la consommation. Conformément aux articles L612-1 et suivants du Code de la
        consommation, tout consommateur peut recourir à la médiation en ligne sur la plateforme
        de règlement des litiges de la Commission européenne :{' '}
        <a
          href="https://ec.europa.eu/consumers/odr"
          target="_blank"
          rel="noopener noreferrer"
        >
          ec.europa.eu/consumers/odr
        </a>
      </p>

      <h2>13. Droit applicable</h2>
      <p>
        Les présentes CGV sont soumises au droit français. En cas de litige, les juridictions
        françaises seront compétentes.
      </p>
    </article>
  );
}
