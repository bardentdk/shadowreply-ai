import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mentions légales — ShadowReply AI',
};

export default function MentionsLegalesPage() {
  return (
    <article className="prose-legal">
      <h1>Mentions légales</h1>
      <p className="text-foreground-muted text-sm">Dernière mise à jour : mai 2026</p>

      <h2>1. Éditeur du site</h2>
      <p>
        Le site <strong>shadowreply.ai</strong> est édité par :
      </p>
      <ul>
        <li><strong>Dénomination sociale :</strong> ShadowReply AI (entreprise individuelle / SASU)</li>
        <li><strong>Siège social :</strong> France</li>
        <li><strong>Email :</strong> contact@shadowreply.ai</li>
        <li><strong>Directeur de la publication :</strong> Le représentant légal de ShadowReply AI</li>
      </ul>

      <h2>2. Hébergement</h2>
      <p>
        Le site est hébergé par :
      </p>
      <ul>
        <li><strong>Vercel Inc.</strong></li>
        <li>440 N Barranca Ave #4133, Covina, CA 91723, États-Unis</li>
        <li>Site : <a href="https://vercel.com" target="_blank" rel="noopener noreferrer">vercel.com</a></li>
      </ul>
      <p>
        Les données des utilisateurs européens sont traitées conformément au RGPD. Vercel dispose de
        garanties appropriées via les clauses contractuelles types de la Commission européenne.
      </p>

      <h2>3. Base de données</h2>
      <p>
        La base de données est hébergée par <strong>Supabase Inc.</strong> (infrastructure sur AWS eu-west-3 / Paris),
        garantissant un hébergement des données au sein de l'Union européenne.
      </p>

      <h2>4. Propriété intellectuelle</h2>
      <p>
        L'ensemble des contenus présents sur le site shadowreply.ai (textes, images, logo, code source,
        algorithmes, interfaces) est protégé par le droit de la propriété intellectuelle et appartient
        exclusivement à ShadowReply AI ou fait l'objet d'autorisations d'utilisation. Toute reproduction,
        représentation ou diffusion, totale ou partielle, sans accord préalable est interdite.
      </p>

      <h2>5. Données personnelles</h2>
      <p>
        Les données personnelles collectées sur ce site sont traitées conformément au Règlement Général
        sur la Protection des Données (RGPD — Règlement (UE) 2016/679) et à la loi Informatique et
        Libertés. Pour en savoir plus, consultez notre{' '}
        <a href="/legal/confidentialite">Politique de confidentialité</a>.
      </p>

      <h2>6. Cookies</h2>
      <p>
        Ce site utilise des cookies. Pour en savoir plus, consultez notre{' '}
        <a href="/legal/cookies">Politique de cookies</a>.
      </p>

      <h2>7. Limitation de responsabilité</h2>
      <p>
        ShadowReply AI s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées sur
        ce site. Toutefois, ShadowReply AI ne peut garantir l'exactitude, la complétude et l'actualité
        des informations diffusées. ShadowReply AI décline toute responsabilité pour tout dommage
        résultant d'une intrusion frauduleuse d'un tiers ayant entraîné une modification des informations
        mises à disposition sur le site.
      </p>
      <p>
        Les réponses générées par l'IA sont fournies à titre indicatif et ne constituent pas des conseils
        juridiques, médicaux ou professionnels. L'utilisateur reste seul responsable de l'usage qu'il
        fait des réponses générées.
      </p>

      <h2>8. Droit applicable</h2>
      <p>
        Les présentes mentions légales sont soumises au droit français. En cas de litige, les tribunaux
        français seront seuls compétents.
      </p>
    </article>
  );
}
