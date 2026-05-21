import type { FrapFormData } from '../types/game';

export const defaultFraps: FrapFormData[] = [
  {
    code: "FRAP-01",
    cycle: "Trésorerie",
    title: "Détournement de fonds",
    criticality: "critique",
    probability: 5,
    impact: 5,
    presenter_credits: 0,
    description:
      "Mme RACH cumule seule encaissement, comptabilisation, rapprochement bancaire et garde des chéquiers.",
    creditActions: {
      1: "Sensibilisation — Note de service rappelant les bonnes pratiques à Mme RACH et à sa hiérarchie.",
      2: "Contrôle renforcé — Validation mensuelle du rapprochement bancaire par le chef comptable. Inventaire trimestriel des chéquiers.",
      3: "Réorganisation totale — Séparation complète : encaissement, comptabilisation et rapprochement confiés à 3 personnes distinctes.",
    },
  },
  {
    code: "FRAP-02",
    cycle: "Trésorerie",
    title: "Émission frauduleuse de paiements",
    criticality: "élevé",
    probability: 4,
    impact: 5,
    presenter_credits: 0,
    description:
      "M. VENTOUX, parti depuis 2 mois, conserve ses droits de signature bancaire.",
    creditActions: {
      1: "Alerte interne — Email au DG et au DAF signalant le risque. Demande orale de révocation aux banques.",
      2: "Révocation formelle — Révocation écrite auprès des 3 banques. Création d'une checklist de départ intégrant les habilitations.",
      3: "Procédure complète — Révocation immédiate + audit de tous les signataires actifs + procédure RH systématique intégrée aux départs.",
    },
  },
  {
    code: "FRAP-03",
    cycle: "Trésorerie",
    title: "Non détection d'erreurs comptables",
    criticality: "élevé",
    probability: 4,
    impact: 4,
    presenter_credits: 0,
    description:
      "Les comptes des banques Y et Z ne font l'objet d'aucun rapprochement mensuel.",
    creditActions: {
      1: "Instruction — Demande au chef comptable d'étendre les rapprochements aux comptes Y et Z sans procédure formalisée.",
      2: "Procédure formalisée — Rapprochement mensuel de tous les comptes avec validation hiérarchique documentée.",
      3: "Contrôle renforcé — Rapprochement mensuel + contrôle trimestriel indépendant + revue des comptes peu utilisés.",
    },
  },
  {
    code: "FRAP-04",
    cycle: "Achats / Stocks",
    title: "Décaissements non justifiés",
    criticality: "critique",
    probability: 5,
    impact: 5,
    presenter_credits: 0,
    description:
      "Les fournisseurs sont réglés sans validation systématique de la réception conforme des marchandises par les établissements.",
    creditActions: {
      1: "Instruction verbale — Demande aux directeurs de transmettre les BR. Sans outil ni contrôle formel.",
      2: "Procédure formalisée — Rapprochement BC+BR+facture obligatoire. Transmission du BR signé avant tout règlement.",
      3: "Système dématérialisé — Outil de validation en 3 voies avec blocage automatique du règlement en l'absence de BR validé.",
    },
  },
  {
    code: "FRAP-05",
    cycle: "Achats / Stocks",
    title: "Risque de décaissements frauduleux ou non autorisés",
    criticality: "critique",
    probability: 5,
    impact: 4,
    presenter_credits: 0,
    description:
      "Certaines opérations de paiement ne disposent pas des pièces justificatives nécessaires.",
    creditActions: {
      1: "Tampon préventif — Apposer un tampon « payé + date + référence » sur chaque facture réglée.",
      2: "Contrôle anti-doublon — Numéro de facture unique en base + archivage horodaté obligatoire des pièces justificatives.",
      3: "Procédure complète — Contrôle anti-doublon + archivage + revue mensuelle des décaissements sans PJ par le DAF.",
    },
  },
  {
    code: "FRAP-06",
    cycle: "Achats / Stocks",
    title: "Conditions d'achat défavorables et hétérogènes",
    criticality: "élevé",
    probability: 4,
    impact: 4,
    presenter_credits: 0,
    description:
      "Les achats sont réalisés sans mise en concurrence ni harmonisation des conditions fournisseurs.",
    creditActions: {
      1: "Harmonisation partielle — Centraliser la négociation sur les 5 principaux fournisseurs au siège.",
      2: "Politique achats groupe — Appel d'offres annuel, référencement fournisseurs, harmonisation des conditions sur tous les établissements.",
      3: "Centrale d'achat dédiée — Cellule achats avec responsable dédié, tableau de bord et renégociation systématique annuelle.",
    },
  },
  {
    code: "FRAP-07",
    cycle: "Stocks",
    title: "Manipulation non détectée des stocks",
    criticality: "critique",
    probability: 5,
    impact: 5,
    presenter_credits: 0,
    description:
      "L'inventaire physique annuel est réalisé par les collaborateurs qui gèrent et enregistrent eux-mêmes les mouvements de stock au quotidien.",
    creditActions: {
      1: "Supervision ponctuelle — Un responsable siège observe l'inventaire sans intervenir dans le comptage.",
      2: "Équipe indépendante — Inventaire réalisé par un service distinct. Toute correction d'écart validée hiérarchiquement.",
      3: "Audit renforcé — Inventaires tournants inopinés + équipe indépendante + procédure d'investigation systématique des écarts > 1 K€.",
    },
  },
  {
    code: "FRAP-08",
    cycle: "Ventes / Réservations",
    title: "Litiges commerciaux & dégradation de l'image",
    criticality: "critique",
    probability: 5,
    impact: 4,
    presenter_credits: 0,
    description:
      "Les factures sont émises au siège sur la base des réservations reçues, sans rapprochement préalable avec les prestations effectivement réalisées dans les établissements.",
    creditActions: {
      1: "Suivi mensuel — Tableau de bord du taux d'avoirs transmis à la direction. Objectif < 5 %.",
      2: "Rapprochement systématique — Transmission d'un récapitulatif signé des prestations servies avant toute émission de facture au siège.",
      3: "Outil partagé — Système centralisé en temps réel entre les établissements et le siège avec blocage de l'émission en cas d'écart.",
    },
  },
  {
    code: "FRAP-09",
    cycle: "Personnel",
    title: "Versement d'acomptes non autorisés ou fictifs",
    criticality: "élevé",
    probability: 4,
    impact: 4,
    presenter_credits: 0,
    description:
      "Absence de validation hiérarchique avant l'octroi d'un acompte.",
    creditActions: {
      1: "Formalisation — Création d'un bon d'acompte à signer par le bénéficiaire et à archiver.",
      2: "Séparation des tâches — Autorisation (DRH), enregistrement (Mme POIREE), versement (comptabilité) confiés à 3 personnes distinctes.",
      3: "Procédure complète — Séparation des tâches + rapprochement mensuel automatique acomptes versés / déductions effectuées en paie.",
    },
  },
  {
    code: "FRAP-10",
    cycle: "Personnel",
    title: "Demandes abusives d'avances sur frais",
    criticality: "élevé",
    probability: 4,
    impact: 3,
    presenter_credits: 0,
    description:
      "Absence de plafond et de conditions formelles d'octroi des avances sur frais de déplacement.",
    creditActions: {
      1: "Délai imposé — Fixer un délai maximal de justification de 30 jours après retour.",
      2: "Règlement interne — Plafond d'avance par déplacement + blocage de toute nouvelle avance si la précédente n'est pas justifiée.",
      3: "Système de suivi — Plafond + blocage + relance automatique + revue mensuelle du compte « avances versées » par le DAF.",
    },
  },
  {
    code: "FRAP-11",
    cycle: "Immobilisations",
    title: "Paiement d'immobilisations non livrées ou défectueuses",
    criticality: "élevé",
    probability: 4,
    impact: 5,
    presenter_credits: 0,
    description:
      "Paiement d'immobilisations avant réception ou avant levée des réserves techniques.",
    creditActions: {
      1: "Instruction — Demander aux directeurs de conditionner le paiement à la réception physique du bien.",
      2: "Procédure formalisée — Appel d'offres obligatoire au-delà de 5 K€ + paiement conditionné à la livraison et à la validation technique.",
      3: "Gouvernance complète — Appel d'offres + analyse de financement + validation DG/DF + paiement conditionné + suivi CAPEX mensuel.",
    },
  },
];

