import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Politique de confidentialité — ShadowReply AI',
};

export default function ConfidentialitePage() {
  return (
    <article className="prose-legal">
      <h1>Politique de confidentialité</h1>
      <p className="text-foreground-muted text-sm">Dernière mise à jour : mai 2026</p>

      <p>
        ShadowReply AI (ci-après « nous » ou « ShadowReply ») s'engage à protéger la vie privée de
        ses utilisateurs. Cette politique de confidentialité explique quelles données nous collectons,
        pourquoi, comment elles sont utilisées et protégées, et quels sont vos droits.
      </p>
      <p>
        Cette politique est conforme au Règlement Général sur la Protection des Données (RGPD —
        Règlement (UE) 2016/679) et à la loi Informatique et Libertés.
      </p>

      <h2>1. Responsable du traitement</h2>
      <p>
        Le responsable du traitement des données personnelles est ShadowReply AI.
        <br />
        Contact DPO : <a href="mailto:dpo@shadowreply.ai">dpo@shadowreply.ai</a>
      </p>

      <h2>2. Données collectées</h2>

      <h3>2.1 Données d&apos;inscription</h3>
      <ul>
        <li>Adresse email (obligatoire)</li>
        <li>Nom / prénom (optionnel)</li>
        <li>Mot de passe (hashé, jamais stocké en clair)</li>
        <li>Date d'inscription et de dernière connexion</li>
      </ul>

      <h3>2.2 Données d&apos;utilisation</h3>
      <ul>
        <li>Historique des textes générés par l'IA (sauf si supprimés par l'utilisateur)</li>
        <li>Paramètres de préférences (langue, ton préféré)</li>
        <li>Statistiques d'utilisation agrégées (nombre de générations, modes utilisés)</li>
        <li>Plan d'abonnement et historique de facturation</li>
      </ul>

      <h3>2.3 Ce que nous ne collectons PAS</h3>
      <ul>
        <li><strong>Les messages d'entrée</strong> que vous soumettez à l'IA ne sont jamais stockés. Ils sont traités en mémoire vive et immédiatement effacés après génération.</li>
        <li>Données de localisation précise</li>
        <li>Contenus de communications privées (hors données soumises volontairement)</li>
      </ul>

      <h3>2.4 Données techniques</h3>
      <ul>
        <li>Adresse IP (pour la sécurité et la prévention des abus)</li>
        <li>User-agent du navigateur</li>
        <li>Cookies essentiels (voir Politique de cookies)</li>
      </ul>

      <h2>3. Finalités et bases légales du traitement</h2>
      <table>
        <thead>
          <tr>
            <th>Finalité</th>
            <th>Base légale</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Création et gestion de compte</td>
            <td>Exécution du contrat</td>
          </tr>
          <tr>
            <td>Fourniture du service IA</td>
            <td>Exécution du contrat</td>
          </tr>
          <tr>
            <td>Facturation et gestion abonnement</td>
            <td>Obligation légale / Exécution du contrat</td>
          </tr>
          <tr>
            <td>Emails transactionnels (confirmation, reset mdp)</td>
            <td>Exécution du contrat</td>
          </tr>
          <tr>
            <td>Sécurité et prévention des fraudes</td>
            <td>Intérêt légitime</td>
          </tr>
          <tr>
            <td>Amélioration du service (stats agrégées)</td>
            <td>Intérêt légitime</td>
          </tr>
          <tr>
            <td>Analytics (si consentement)</td>
            <td>Consentement</td>
          </tr>
        </tbody>
      </table>

      <h2>4. Sous-traitants et transferts de données</h2>
      <p>Nous faisons appel aux sous-traitants suivants :</p>
      <ul>
        <li>
          <strong>Supabase</strong> — Hébergement de la base de données (EU, Paris). Conforme RGPD.
        </li>
        <li>
          <strong>Vercel</strong> — Hébergement de l'application. Dispose de clauses contractuelles
          types pour les transferts hors UE.
        </li>
        <li>
          <strong>Stripe</strong> — Paiement en ligne. Certifié PCI DSS. Données de facturation
          hébergées aux États-Unis avec garanties adéquates.
        </li>
        <li>
          <strong>Groq / Anthropic / OpenAI / Google</strong> — Traitement IA. Les messages soumis
          sont transmis de manière éphémère pour traitement uniquement et ne sont pas stockés par
          ces fournisseurs dans le cadre de nos contrats API.
        </li>
      </ul>

      <h2>5. Durée de conservation</h2>
      <ul>
        <li><strong>Données de compte :</strong> jusqu'à la suppression du compte + 30 jours (sauvegarde)</li>
        <li><strong>Historique des générations :</strong> illimité (Pro) / 30 jours (Gratuit), ou jusqu'à suppression manuelle</li>
        <li><strong>Données de facturation :</strong> 10 ans (obligation légale comptable)</li>
        <li><strong>Logs de sécurité :</strong> 12 mois maximum</li>
      </ul>

      <h2>6. Vos droits</h2>
      <p>Conformément au RGPD, vous disposez des droits suivants :</p>
      <ul>
        <li><strong>Droit d'accès</strong> — Obtenir une copie de vos données personnelles</li>
        <li><strong>Droit de rectification</strong> — Corriger des données inexactes</li>
        <li><strong>Droit à l'effacement</strong> — Supprimer vos données (« droit à l'oubli »)</li>
        <li><strong>Droit à la portabilité</strong> — Recevoir vos données dans un format structuré</li>
        <li><strong>Droit d'opposition</strong> — Vous opposer à certains traitements basés sur l'intérêt légitime</li>
        <li><strong>Droit à la limitation</strong> — Restreindre temporairement le traitement</li>
        <li><strong>Retrait du consentement</strong> — À tout moment, pour les traitements basés sur le consentement</li>
      </ul>
      <p>
        Pour exercer ces droits, contactez-nous à{' '}
        <a href="mailto:dpo@shadowreply.ai">dpo@shadowreply.ai</a> en joignant une pièce d'identité.
        Nous répondrons dans un délai d'un mois.
      </p>
      <p>
        Vous pouvez également introduire une réclamation auprès de la CNIL :{' '}
        <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">www.cnil.fr</a>
      </p>

      <h2>7. Sécurité</h2>
      <p>
        Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger
        vos données contre tout accès non autorisé, modification, divulgation ou destruction :
      </p>
      <ul>
        <li>Chiffrement des données en transit (HTTPS/TLS 1.3)</li>
        <li>Chiffrement des données au repos</li>
        <li>Hashage des mots de passe (bcrypt)</li>
        <li>Authentification sécurisée via Supabase Auth</li>
        <li>Accès aux données restreint par Row Level Security (RLS)</li>
        <li>Révision régulière des accès et permissions</li>
      </ul>

      <h2>8. Cookies</h2>
      <p>
        Pour les informations détaillées sur les cookies, consultez notre{' '}
        <a href="/legal/cookies">Politique de cookies</a>.
      </p>

      <h2>9. Modifications de cette politique</h2>
      <p>
        Nous pouvons mettre à jour cette politique à tout moment. En cas de modification substantielle,
        nous vous informerons par email ou notification dans l'application. La date de dernière mise à
        jour est indiquée en haut de ce document.
      </p>

      <h2>10. Contact</h2>
      <p>
        Pour toute question relative à la protection de vos données :{' '}
        <a href="mailto:dpo@shadowreply.ai">dpo@shadowreply.ai</a>
      </p>
    </article>
  );
}
