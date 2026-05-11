import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Conditions Générales d'Utilisation — ShadowReply AI",
};

export default function CguPage() {
  return (
    <article className="prose-legal">
      <h1>Conditions Générales d&apos;Utilisation (CGU)</h1>
      <p className="text-foreground-muted text-sm">Dernière mise à jour : mai 2026</p>

      <h2>1. Objet</h2>
      <p>
        Les présentes Conditions Générales d'Utilisation (ci-après « CGU ») régissent l'accès et
        l'utilisation du service ShadowReply AI accessible à l'adresse shadowreply.ai (ci-après « le
        Service »). En créant un compte ou en utilisant le Service, l'utilisateur accepte sans réserve
        les présentes CGU.
      </p>

      <h2>2. Description du Service</h2>
      <p>
        ShadowReply AI est un service d'assistance à la communication utilisant l'intelligence
        artificielle. Il permet à ses utilisateurs de :
      </p>
      <ul>
        <li>Générer des réponses stratégiques à des messages reçus ;</li>
        <li>Analyser le ton et l'intention d'un message ;</li>
        <li>Reformuler des brouillons de messages ;</li>
        <li>Accéder à une bibliothèque de templates de scénarios ;</li>
        <li>Consulter des statistiques sur leurs interactions.</li>
      </ul>

      <h2>3. Inscription et compte utilisateur</h2>
      <p>
        L'accès au Service nécessite la création d'un compte. L'utilisateur s'engage à fournir des
        informations exactes et à les maintenir à jour. Il est seul responsable de la confidentialité
        de ses identifiants de connexion. Tout accès au Service via son compte est réputé effectué
        par l'utilisateur.
      </p>
      <p>
        ShadowReply AI se réserve le droit de suspendre ou de supprimer tout compte en cas de
        violation des présentes CGU, d'activité frauduleuse ou de comportement abusif.
      </p>

      <h2>4. Utilisation autorisée</h2>
      <p>L'utilisateur s'engage à utiliser le Service uniquement à des fins licites et conformes aux présentes CGU. Il est notamment interdit de :</p>
      <ul>
        <li>Utiliser le Service à des fins illégales, harcelantes, diffamatoires ou malveillantes ;</li>
        <li>Tenter de contourner les limites de quota ou les systèmes de sécurité ;</li>
        <li>Extraire, scraper ou reproduire le contenu du Service de manière automatisée ;</li>
        <li>Partager ses identifiants de connexion avec des tiers ;</li>
        <li>Utiliser le Service pour générer du contenu visant à tromper, manipuler ou escroquer autrui ;</li>
        <li>Soumettre des messages à caractère illicite (apologie de violence, contenus pédopornographiques, incitation à la haine…).</li>
      </ul>

      <h2>5. Plans et quotas</h2>
      <p>
        Le Service est proposé en deux plans tarifaires : Gratuit et Pro. Les caractéristiques de
        chaque plan (quotas de génération, fonctionnalités accessibles) sont décrites sur la page
        Tarifs et peuvent évoluer. ShadowReply AI s'engage à informer les utilisateurs de toute
        modification substantielle avec un préavis raisonnable.
      </p>

      <h2>6. Responsabilité de l'utilisateur</h2>
      <p>
        L'utilisateur est seul responsable du contenu des messages qu'il soumet au Service et de
        l'usage qu'il fait des réponses générées par l'IA. Les réponses générées sont fournies à
        titre informatif et indicatif. ShadowReply AI ne garantit pas leur pertinence, exactitude
        ou adéquation à une situation particulière.
      </p>

      <h2>7. Propriété intellectuelle</h2>
      <p>
        ShadowReply AI concède à l'utilisateur un droit d'utilisation personnel, non exclusif et
        non transférable sur le Service. Ce droit ne comprend pas le droit de reproduire, modifier,
        distribuer ou exploiter commercialement le Service ou ses composants.
      </p>
      <p>
        Les contenus générés par l'IA à partir des messages de l'utilisateur sont la propriété de
        l'utilisateur dans la mesure où ils résultent de ses inputs. ShadowReply AI ne revendique
        aucun droit de propriété sur ces contenus.
      </p>

      <h2>8. Disponibilité du Service</h2>
      <p>
        ShadowReply AI s'efforce d'assurer la disponibilité du Service 24h/24, 7j/7, mais ne peut
        garantir une disponibilité sans interruption. Des maintenances ou perturbations peuvent
        survenir. ShadowReply AI ne sera pas responsable des dommages liés à une indisponibilité du
        Service.
      </p>

      <h2>9. Limitation de responsabilité</h2>
      <p>
        Dans la limite du droit applicable, la responsabilité de ShadowReply AI est limitée aux
        dommages directs prouvés, à hauteur des sommes effectivement payées par l'utilisateur au
        cours des 3 mois précédant le fait générateur. ShadowReply AI exclut toute responsabilité
        pour dommages indirects (perte de données, manque à gagner, atteinte à la réputation).
      </p>

      <h2>10. Modification des CGU</h2>
      <p>
        ShadowReply AI peut modifier les présentes CGU à tout moment. Les utilisateurs seront
        informés par email ou notification dans l'application au moins 15 jours avant l'entrée en
        vigueur des nouvelles conditions. La poursuite de l'utilisation du Service après ce délai
        vaut acceptation des nouvelles CGU.
      </p>

      <h2>11. Résiliation</h2>
      <p>
        L'utilisateur peut résilier son compte à tout moment. ShadowReply AI peut résilier le
        compte d'un utilisateur en cas de violation grave des présentes CGU, avec ou sans préavis.
      </p>

      <h2>12. Droit applicable et litiges</h2>
      <p>
        Les présentes CGU sont soumises au droit français. En cas de litige, les parties s'efforceront
        de trouver une solution amiable. À défaut, les tribunaux de Paris seront seuls compétents.
      </p>

      <h2>13. Contact</h2>
      <p>
        Pour toute question relative aux présentes CGU :{' '}
        <a href="mailto:contact@shadowreply.ai">contact@shadowreply.ai</a>
      </p>
    </article>
  );
}
