export interface VectorRequirement {
  ideal: number; // 0.0 to 1.0
  weight: number; // 0.0 to 1.0
}

export interface CareerVectors {
  aptitudes: {
    numerical: VectorRequirement;
    verbal: VectorRequirement;
    abstract: VectorRequirement;
    spatial: VectorRequirement;
  };
  interests: {
    realistic: VectorRequirement;
    investigative: VectorRequirement;
    artistic: VectorRequirement;
    social: VectorRequirement;
    enterprising: VectorRequirement;
    conventional: VectorRequirement;
  };
  personality: {
    openness: VectorRequirement;
    conscientiousness: VectorRequirement;
    extraversion: VectorRequirement;
    agreeableness: VectorRequirement;
    stability: VectorRequirement;
  };
  values: {
    independence: VectorRequirement;
    achievement: VectorRequirement;
    relationships: VectorRequirement;
    support: VectorRequirement;
  };
}

export interface AcademicPrereq {
  subject: string;
  minGrade: string; // e.g., 'C6', 'C5'
}

export interface Occupation {
  id: string;
  title: string;
  description: string;
  outlook: string;
  salaryRange: string;
  vectors: CareerVectors;
  jssTrack: 'science' | 'commercial' | 'arts' | 'technical';
  waecSubjects: AcademicPrereq[];
  jambSubjects: string[];
  skills: string[];
  alternativePathways: string;
}

export interface CareerCluster {
  id: string;
  name: string;
  description: string;
  occupations: Occupation[];
}

export const CAREER_TAXONOMY: CareerCluster[] = [
  {
    id: "CL-MED",
    name: "Medicine & Health Sciences",
    description: "Clinical practice, pharmacy care, community nursing, and advanced medical diagnostics.",
    occupations: [
      {
        id: "OC-MED-001",
        title: "Medical Practitioner / Doctor",
        description: "Diagnoses, treats, and prevents human physical and mental illnesses and diseases in clinical settings.",
        outlook: "High Growth (Driven by global health demand and clinical specialization)",
        salaryRange: "₦400,000 - ₦1,200,000 / month",
        jssTrack: "science",
        waecSubjects: [
          { subject: "Mathematics", minGrade: "C6" },
          { subject: "English Language", minGrade: "C6" },
          { subject: "Biology", minGrade: "C5" },
          { subject: "Chemistry", minGrade: "C5" },
          { subject: "Physics", minGrade: "C5" }
        ],
        jambSubjects: ["English Language", "Biology", "Chemistry", "Physics"],
        skills: ["Clinical Diagnosis", "Patient Empathy", "Surgical Precision", "Ethics"],
        alternativePathways: "University: MB.BS Medicine & Surgery; Postgrad residency certifications.",
        vectors: {
          aptitudes: {
            numerical: { ideal: 0.70, weight: 0.10 },
            verbal: { ideal: 0.75, weight: 0.15 },
            abstract: { ideal: 0.80, weight: 0.15 },
            spatial: { ideal: 0.60, weight: 0.05 }
          },
          interests: {
            realistic: { ideal: 0.50, weight: 0.05 },
            investigative: { ideal: 0.90, weight: 0.25 },
            artistic: { ideal: 0.35, weight: 0.00 },
            social: { ideal: 0.85, weight: 0.20 },
            enterprising: { ideal: 0.60, weight: 0.05 },
            conventional: { ideal: 0.75, weight: 0.10 }
          },
          personality: {
            openness: { ideal: 0.70, weight: 0.05 },
            conscientiousness: { ideal: 0.90, weight: 0.20 },
            extraversion: { ideal: 0.55, weight: 0.05 },
            agreeableness: { ideal: 0.80, weight: 0.10 },
            stability: { ideal: 0.85, weight: 0.10 }
          },
          values: {
            independence: { ideal: 0.60, weight: 0.05 },
            achievement: { ideal: 0.85, weight: 0.15 },
            relationships: { ideal: 0.80, weight: 0.15 },
            support: { ideal: 0.75, weight: 0.05 }
          }
        }
      },
      {
        id: "OC-MED-002",
        title: "Clinical Pharmacist",
        description: "Prepares, dispenses, and counsels patients on medical therapies and pharmaceuticals.",
        outlook: "High Growth (Driven by pharmaceutical research and local drug retail networks)",
        salaryRange: "₦300,000 - ₦700,000 / month",
        jssTrack: "science",
        waecSubjects: [
          { subject: "Mathematics", minGrade: "C6" },
          { subject: "English Language", minGrade: "C6" },
          { subject: "Biology", minGrade: "C6" },
          { subject: "Chemistry", minGrade: "C5" },
          { subject: "Physics", minGrade: "C6" }
        ],
        jambSubjects: ["English Language", "Biology", "Chemistry", "Physics"],
        skills: ["Chemical Formulation", "Therapeutics", "Regulatory Compliance", "Patient Care"],
        alternativePathways: "University: Doctor of Pharmacy (Pharm.D) or B.Pharm degree.",
        vectors: {
          aptitudes: {
            numerical: { ideal: 0.75, weight: 0.15 },
            verbal: { ideal: 0.70, weight: 0.10 },
            abstract: { ideal: 0.75, weight: 0.15 },
            spatial: { ideal: 0.50, weight: 0.00 }
          },
          interests: {
            realistic: { ideal: 0.45, weight: 0.05 },
            investigative: { ideal: 0.85, weight: 0.20 },
            artistic: { ideal: 0.30, weight: 0.00 },
            social: { ideal: 0.75, weight: 0.15 },
            enterprising: { ideal: 0.60, weight: 0.10 },
            conventional: { ideal: 0.80, weight: 0.20 }
          },
          personality: {
            openness: { ideal: 0.65, weight: 0.05 },
            conscientiousness: { ideal: 0.85, weight: 0.15 },
            extraversion: { ideal: 0.50, weight: 0.05 },
            agreeableness: { ideal: 0.75, weight: 0.05 },
            stability: { ideal: 0.80, weight: 0.10 }
          },
          values: {
            independence: { ideal: 0.70, weight: 0.10 },
            achievement: { ideal: 0.80, weight: 0.15 },
            relationships: { ideal: 0.75, weight: 0.05 },
            support: { ideal: 0.70, weight: 0.05 }
          }
        }
      }
    ]
  },
  {
    id: "CL-TECH",
    name: "Software & Digital Systems",
    description: "Building scalable software infrastructure, mobile systems, web platforms, and data architectures.",
    occupations: [
      {
        id: "OC-SFT-001",
        title: "Software Engineer",
        description: "Creates computer programs, mobile applications, and web services that solve local problems.",
        outlook: "Extreme Growth (High remote and local corporate demand)",
        salaryRange: "₦400,000 - ₦1,200,000 / month",
        jssTrack: "science",
        waecSubjects: [
          { subject: "Mathematics", minGrade: "C5" },
          { subject: "English Language", minGrade: "C6" },
          { subject: "Physics", minGrade: "C6" },
          { subject: "Chemistry", minGrade: "C6" }
        ],
        jambSubjects: ["English Language", "Mathematics", "Physics", "Chemistry"],
        skills: ["Programming", "Algorithmic Thinking", "System Design", "Collaboration"],
        alternativePathways: "University: B.Sc Computer Science; Poly: HND Software Dev; Vocational: Coding Bootcamps & Internships.",
        vectors: {
          aptitudes: {
            numerical: { ideal: 0.80, weight: 0.20 },
            verbal: { ideal: 0.60, weight: 0.10 },
            abstract: { ideal: 0.85, weight: 0.20 },
            spatial: { ideal: 0.55, weight: 0.05 }
          },
          interests: {
            realistic: { ideal: 0.60, weight: 0.10 },
            investigative: { ideal: 0.85, weight: 0.20 },
            artistic: { ideal: 0.40, weight: 0.05 },
            social: { ideal: 0.45, weight: 0.05 },
            enterprising: { ideal: 0.50, weight: 0.05 },
            conventional: { ideal: 0.70, weight: 0.10 }
          },
          personality: {
            openness: { ideal: 0.75, weight: 0.10 },
            conscientiousness: { ideal: 0.80, weight: 0.15 },
            extraversion: { ideal: 0.40, weight: 0.05 },
            agreeableness: { ideal: 0.55, weight: 0.05 },
            stability: { ideal: 0.70, weight: 0.05 }
          },
          values: {
            independence: { ideal: 0.80, weight: 0.15 },
            achievement: { ideal: 0.85, weight: 0.15 },
            relationships: { ideal: 0.50, weight: 0.05 },
            support: { ideal: 0.60, weight: 0.05 }
          }
        }
      },
      {
        id: "OC-UX-001",
        title: "Digital Product Designer",
        description: "Designs the interfaces and interactive flows of apps, websites, and software to make them easy and delightful to use.",
        outlook: "High Growth (Driven by consumer tech expansion)",
        salaryRange: "₦300,000 - ₦800,000 / month",
        jssTrack: "arts",
        waecSubjects: [
          { subject: "Mathematics", minGrade: "D7" },
          { subject: "English Language", minGrade: "C5" },
          { subject: "Fine Art / Literature", minGrade: "C6" }
        ],
        jambSubjects: ["English Language", "Literature-in-English", "Fine Arts", "Government"],
        skills: ["Visual Design", "User Empathy", "Wireframing", "Communication"],
        alternativePathways: "University: B.A. Fine Arts or B.Sc Info Tech; Vocational: UX certifications and portfolio design.",
        vectors: {
          aptitudes: {
            numerical: { ideal: 0.45, weight: 0.05 },
            verbal: { ideal: 0.70, weight: 0.15 },
            abstract: { ideal: 0.75, weight: 0.15 },
            spatial: { ideal: 0.80, weight: 0.15 }
          },
          interests: {
            realistic: { ideal: 0.30, weight: 0.00 },
            investigative: { ideal: 0.65, weight: 0.10 },
            artistic: { ideal: 0.90, weight: 0.25 },
            social: { ideal: 0.70, weight: 0.10 },
            enterprising: { ideal: 0.55, weight: 0.05 },
            conventional: { ideal: 0.45, weight: 0.05 }
          },
          personality: {
            openness: { ideal: 0.85, weight: 0.15 },
            conscientiousness: { ideal: 0.70, weight: 0.10 },
            extraversion: { ideal: 0.60, weight: 0.05 },
            agreeableness: { ideal: 0.75, weight: 0.10 },
            stability: { ideal: 0.60, weight: 0.05 }
          },
          values: {
            independence: { ideal: 0.75, weight: 0.10 },
            achievement: { ideal: 0.80, weight: 0.10 },
            relationships: { ideal: 0.70, weight: 0.10 },
            support: { ideal: 0.65, weight: 0.05 }
          }
        }
      }
    ]
  },
  {
    id: "CL-ENG",
    name: "Engineering & Infrastructure",
    description: "Designing mechanical structures, power systems, civil bridges, and robotic installations.",
    occupations: [
      {
        id: "OC-ENG-001",
        title: "Robotics Systems Engineer",
        description: "Designs robotic mechanisms, automation systems, and embedded hardware for logistics and industry.",
        outlook: "High Growth (Driven by automation and supply chain expansions)",
        salaryRange: "₦400,000 - ₦1,000,000 / month",
        jssTrack: "technical",
        waecSubjects: [
          { subject: "Mathematics", minGrade: "C5" },
          { subject: "English Language", minGrade: "C6" },
          { subject: "Physics", minGrade: "C5" },
          { subject: "Chemistry", minGrade: "C6" }
        ],
        jambSubjects: ["English Language", "Mathematics", "Physics", "Chemistry"],
        skills: ["Robotic Kinematics", "Microcontrollers", "CAD Design", "Programming"],
        alternativePathways: "University: B.Eng Computer or Mechatronics Engineering; Vocational: Hardware prototyping guilds.",
        vectors: {
          aptitudes: {
            numerical: { ideal: 0.85, weight: 0.20 },
            verbal: { ideal: 0.55, weight: 0.05 },
            abstract: { ideal: 0.85, weight: 0.20 },
            spatial: { ideal: 0.80, weight: 0.15 }
          },
          interests: {
            realistic: { ideal: 0.90, weight: 0.25 },
            investigative: { ideal: 0.85, weight: 0.20 },
            artistic: { ideal: 0.40, weight: 0.00 },
            social: { ideal: 0.40, weight: 0.05 },
            enterprising: { ideal: 0.60, weight: 0.10 },
            conventional: { ideal: 0.65, weight: 0.05 }
          },
          personality: {
            openness: { ideal: 0.75, weight: 0.10 },
            conscientiousness: { ideal: 0.80, weight: 0.15 },
            extraversion: { ideal: 0.50, weight: 0.05 },
            agreeableness: { ideal: 0.55, weight: 0.05 },
            stability: { ideal: 0.75, weight: 0.05 }
          },
          values: {
            independence: { ideal: 0.75, weight: 0.10 },
            achievement: { ideal: 0.85, weight: 0.15 },
            relationships: { ideal: 0.50, weight: 0.05 },
            support: { ideal: 0.65, weight: 0.05 }
          }
        }
      }
    ]
  },
  {
    id: "CL-SCI",
    name: "Scientific Research & Exploration",
    description: "Biochemical testing, earth exploration sciences, microbiology, and geoinformatics.",
    occupations: [
      {
        id: "OC-SCI-001",
        title: "Exploration Geologist",
        description: "Surveys earth resources, minerals, and water deposits using physical testing and GIS mapping.",
        outlook: "Moderate Growth (Driven by energy diversification and mining concessions)",
        salaryRange: "₦300,000 - ₦800,000 / month",
        jssTrack: "science",
        waecSubjects: [
          { subject: "Mathematics", minGrade: "C6" },
          { subject: "English Language", minGrade: "C6" },
          { subject: "Physics", minGrade: "C6" },
          { subject: "Chemistry", minGrade: "C6" },
          { subject: "Geography", minGrade: "C6" }
        ],
        jambSubjects: ["English Language", "Mathematics", "Physics", "Chemistry"],
        skills: ["Mineralogy", "Geospatial Analysis", "Field Surveying", "Report Writing"],
        alternativePathways: "University: B.Sc Geology or Earth Sciences; Poly: ND Mining Tech.",
        vectors: {
          aptitudes: {
            numerical: { ideal: 0.70, weight: 0.15 },
            verbal: { ideal: 0.60, weight: 0.10 },
            abstract: { ideal: 0.75, weight: 0.15 },
            spatial: { ideal: 0.85, weight: 0.20 }
          },
          interests: {
            realistic: { ideal: 0.85, weight: 0.20 },
            investigative: { ideal: 0.80, weight: 0.20 },
            artistic: { ideal: 0.35, weight: 0.00 },
            social: { ideal: 0.40, weight: 0.05 },
            enterprising: { ideal: 0.55, weight: 0.05 },
            conventional: { ideal: 0.70, weight: 0.10 }
          },
          personality: {
            openness: { ideal: 0.70, weight: 0.05 },
            conscientiousness: { ideal: 0.80, weight: 0.15 },
            extraversion: { ideal: 0.45, weight: 0.05 },
            agreeableness: { ideal: 0.55, weight: 0.05 },
            stability: { ideal: 0.75, weight: 0.10 }
          },
          values: {
            independence: { ideal: 0.75, weight: 0.10 },
            achievement: { ideal: 0.80, weight: 0.15 },
            relationships: { ideal: 0.50, weight: 0.05 },
            support: { ideal: 0.65, weight: 0.05 }
          }
        }
      }
    ]
  },
  {
    id: "CL-FIN",
    name: "Business & Financial Technologies",
    description: "Fintech, commerce operations, product management, accounting, and growth entrepreneurship.",
    occupations: [
      {
        id: "OC-FIN-001",
        title: "FinTech Analyst",
        description: "Assesses market dynamics, payment structures, and digital currencies to design inclusive credit or savings products.",
        outlook: "High Growth (Driven by mobile wallet growth in Africa)",
        salaryRange: "₦350,000 - ₦900,000 / month",
        jssTrack: "commercial",
        waecSubjects: [
          { subject: "Mathematics", minGrade: "C4" },
          { subject: "English Language", minGrade: "C5" },
          { subject: "Economics", minGrade: "C5" },
          { subject: "Financial Accounting", minGrade: "C6" }
        ],
        jambSubjects: ["English Language", "Mathematics", "Economics", "Commerce"],
        skills: ["Financial Analysis", "Quantitative Logic", "Market Research", "Reporting"],
        alternativePathways: "University: B.Sc Finance, Economics or Accounting; Certifications: CFA path, FinTech specialized certificates.",
        vectors: {
          aptitudes: {
            numerical: { ideal: 0.85, weight: 0.20 },
            verbal: { ideal: 0.75, weight: 0.15 },
            abstract: { ideal: 0.70, weight: 0.10 },
            spatial: { ideal: 0.45, weight: 0.00 }
          },
          interests: {
            realistic: { ideal: 0.35, weight: 0.00 },
            investigative: { ideal: 0.75, weight: 0.15 },
            artistic: { ideal: 0.30, weight: 0.00 },
            social: { ideal: 0.50, weight: 0.05 },
            enterprising: { ideal: 0.80, weight: 0.20 },
            conventional: { ideal: 0.80, weight: 0.20 }
          },
          personality: {
            openness: { ideal: 0.60, weight: 0.05 },
            conscientiousness: { ideal: 0.85, weight: 0.20 },
            extraversion: { ideal: 0.65, weight: 0.10 },
            agreeableness: { ideal: 0.55, weight: 0.05 },
            stability: { ideal: 0.70, weight: 0.05 }
          },
          values: {
            independence: { ideal: 0.65, weight: 0.05 },
            achievement: { ideal: 0.85, weight: 0.15 },
            relationships: { ideal: 0.50, weight: 0.05 },
            support: { ideal: 0.70, weight: 0.05 }
          }
        }
      }
    ]
  },
  {
    id: "CL-LAW",
    name: "Law & Corporate Governance",
    description: "Jurisprudence, constitutional advocacy, corporate contracts, and public administration.",
    occupations: [
      {
        id: "OC-LAW-001",
        title: "Corporate Legal Advisor",
        description: "Drafts contracts, manages intellectual property, and ensures compliance for corporate structures and start-ups.",
        outlook: "Steady Growth (Driven by regulatory changes and corporate legal audits)",
        salaryRange: "₦300,000 - ₦900,000 / month",
        jssTrack: "arts",
        waecSubjects: [
          { subject: "English Language", minGrade: "C5" },
          { subject: "Literature-in-English", minGrade: "C5" },
          { subject: "Mathematics", minGrade: "D7" },
          { subject: "Government", minGrade: "C6" }
        ],
        jambSubjects: ["English Language", "Literature-in-English", "Government", "Economics"],
        skills: ["Legal Advocacy", "Contract Drafting", "Critical Analysis", "Speech"],
        alternativePathways: "University: LL.B Law; Nigerian Law School Qualifying Certificate.",
        vectors: {
          aptitudes: {
            numerical: { ideal: 0.45, weight: 0.05 },
            verbal: { ideal: 0.90, weight: 0.25 },
            abstract: { ideal: 0.75, weight: 0.15 },
            spatial: { ideal: 0.40, weight: 0.00 }
          },
          interests: {
            realistic: { ideal: 0.30, weight: 0.00 },
            investigative: { ideal: 0.80, weight: 0.15 },
            artistic: { ideal: 0.60, weight: 0.05 },
            social: { ideal: 0.75, weight: 0.15 },
            enterprising: { ideal: 0.85, weight: 0.20 },
            conventional: { ideal: 0.65, weight: 0.05 }
          },
          personality: {
            openness: { ideal: 0.80, weight: 0.10 },
            conscientiousness: { ideal: 0.85, weight: 0.15 },
            extraversion: { ideal: 0.80, weight: 0.15 },
            agreeableness: { ideal: 0.60, weight: 0.05 },
            stability: { ideal: 0.75, weight: 0.05 }
          },
          values: {
            independence: { ideal: 0.80, weight: 0.15 },
            achievement: { ideal: 0.85, weight: 0.15 },
            relationships: { ideal: 0.60, weight: 0.05 },
            support: { ideal: 0.60, weight: 0.05 }
          }
        }
      }
    ]
  },
  {
    id: "CL-CREA",
    name: "Creative Arts & Creator Economy",
    description: "Visual media, music architecture, content design, fashion, and digital storytelling.",
    occupations: [
      {
        id: "OC-CRE-001",
        title: "Music & Audio Architect",
        description: "Produces music tracks, record mixes, and handles audio design for media campaigns, video games, and film.",
        outlook: "Very High Growth (Driven by global Afrobeat boom and media content creation)",
        salaryRange: "₦200,000 - ₦1,500,000 / project",
        jssTrack: "arts",
        waecSubjects: [
          { subject: "English Language", minGrade: "C6" },
          { subject: "Literature-in-English", minGrade: "C6" },
          { subject: "Fine Art / Literature", minGrade: "D7" }
        ],
        jambSubjects: ["English Language", "Literature-in-English", "Fine Arts", "Government"],
        skills: ["Sound Production", "Acoustic Logic", "Creative Ideation", "Collaboration"],
        alternativePathways: "Vocational: Audio engineering certificates, apprenticeships in studios, self-taught portfolio.",
        vectors: {
          aptitudes: {
            numerical: { ideal: 0.40, weight: 0.05 },
            verbal: { ideal: 0.65, weight: 0.10 },
            abstract: { ideal: 0.70, weight: 0.15 },
            spatial: { ideal: 0.60, weight: 0.10 }
          },
          interests: {
            realistic: { ideal: 0.55, weight: 0.10 },
            investigative: { ideal: 0.50, weight: 0.05 },
            artistic: { ideal: 0.95, weight: 0.25 },
            social: { ideal: 0.60, weight: 0.05 },
            enterprising: { ideal: 0.70, weight: 0.15 },
            conventional: { ideal: 0.35, weight: 0.00 }
          },
          personality: {
            openness: { ideal: 0.90, weight: 0.20 },
            conscientiousness: { ideal: 0.60, weight: 0.05 },
            extraversion: { ideal: 0.70, weight: 0.10 },
            agreeableness: { ideal: 0.65, weight: 0.05 },
            stability: { ideal: 0.55, weight: 0.05 }
          },
          values: {
            independence: { ideal: 0.85, weight: 0.15 },
            achievement: { ideal: 0.80, weight: 0.10 },
            relationships: { ideal: 0.65, weight: 0.05 },
            support: { ideal: 0.50, weight: 0.05 }
          }
        }
      }
    ]
  },
  {
    id: "CL-EDU",
    name: "Educational Services & Tech",
    description: "Curriculum development, guidance counselling, and educational technology structures.",
    occupations: [
      {
        id: "OC-EDU-001",
        title: "EdTech Planner",
        description: "Designs and deploys virtual classrooms, digital curricula, and assessment metrics for schools and learning apps.",
        outlook: "High Growth (Driven by virtual schooling and online education grids)",
        salaryRange: "₦200,000 - ₦550,000 / month",
        jssTrack: "science",
        waecSubjects: [
          { subject: "Mathematics", minGrade: "C6" },
          { subject: "English Language", minGrade: "C6" },
          { subject: "Physics", minGrade: "C6" },
          { subject: "Chemistry", minGrade: "C6" }
        ],
        jambSubjects: ["English Language", "Mathematics", "Physics", "Chemistry"],
        skills: ["Curriculum Design", "LMS Administration", "Instructional Design", "Counselling"],
        alternativePathways: "University: B.Sc.Ed Education & Mathematics or Guidance Counselling.",
        vectors: {
          aptitudes: {
            numerical: { ideal: 0.65, weight: 0.10 },
            verbal: { ideal: 0.80, weight: 0.20 },
            abstract: { ideal: 0.70, weight: 0.10 },
            spatial: { ideal: 0.50, weight: 0.00 }
          },
          interests: {
            realistic: { ideal: 0.35, weight: 0.00 },
            investigative: { ideal: 0.65, weight: 0.10 },
            artistic: { ideal: 0.50, weight: 0.05 },
            social: { ideal: 0.90, weight: 0.25 },
            enterprising: { ideal: 0.60, weight: 0.10 },
            conventional: { ideal: 0.65, weight: 0.10 }
          },
          personality: {
            openness: { ideal: 0.80, weight: 0.10 },
            conscientiousness: { ideal: 0.80, weight: 0.15 },
            extraversion: { ideal: 0.70, weight: 0.10 },
            agreeableness: { ideal: 0.85, weight: 0.10 },
            stability: { ideal: 0.75, weight: 0.05 }
          },
          values: {
            independence: { ideal: 0.60, weight: 0.05 },
            achievement: { ideal: 0.80, weight: 0.15 },
            relationships: { ideal: 0.90, weight: 0.20 },
            support: { ideal: 0.75, weight: 0.05 }
          }
        }
      }
    ]
  },
  {
    id: "CL-AGRI",
    name: "Smart Agriculture & Bio-Systems",
    description: "High-skill tech, analytics, and biological sciences applied to food security and farm modernization.",
    occupations: [
      {
        id: "OC-AGR-001",
        title: "Agritech Specialist",
        description: "Uses Internet of Things (IoT) sensors, drone mapping, and mobile technologies to optimize crop yields and soil management.",
        outlook: "High Growth (Driven by agricultural reform and mobile penetration)",
        salaryRange: "₦250,000 - ₦600,000 / month",
        jssTrack: "science",
        waecSubjects: [
          { subject: "Mathematics", minGrade: "C6" },
          { subject: "Agricultural Science", minGrade: "C5" },
          { subject: "Biology", minGrade: "C6" },
          { subject: "Chemistry", minGrade: "C6" }
        ],
        jambSubjects: ["English Language", "Agricultural Science", "Chemistry", "Biology"],
        skills: ["Data Analysis", "Sensor Setup", "Drone Control", "Problem Solving"],
        alternativePathways: "University: B.Agric Agronomy; Poly: HND Smart Farming; Vocational: National Innovation Diploma.",
        vectors: {
          aptitudes: {
            numerical: { ideal: 0.60, weight: 0.15 },
            verbal: { ideal: 0.50, weight: 0.10 },
            abstract: { ideal: 0.70, weight: 0.15 },
            spatial: { ideal: 0.65, weight: 0.10 }
          },
          interests: {
            realistic: { ideal: 0.85, weight: 0.20 },
            investigative: { ideal: 0.75, weight: 0.15 },
            artistic: { ideal: 0.30, weight: 0.00 },
            social: { ideal: 0.40, weight: 0.05 },
            enterprising: { ideal: 0.60, weight: 0.10 },
            conventional: { ideal: 0.55, weight: 0.05 }
          },
          personality: {
            openness: { ideal: 0.70, weight: 0.10 },
            conscientiousness: { ideal: 0.75, weight: 0.15 },
            extraversion: { ideal: 0.40, weight: 0.05 },
            agreeableness: { ideal: 0.60, weight: 0.05 },
            stability: { ideal: 0.65, weight: 0.05 }
          },
          values: {
            independence: { ideal: 0.70, weight: 0.10 },
            achievement: { ideal: 0.80, weight: 0.15 },
            relationships: { ideal: 0.50, weight: 0.05 },
            support: { ideal: 0.60, weight: 0.05 }
          }
        }
      }
    ]
  },
  {
    id: "CL-AVIA",
    name: "Aviation & Aerospace Operations",
    description: "Meteorology, space sciences, commercial drone piloting, and aviation control.",
    occupations: [
      {
        id: "OC-AV-001",
        title: "Commercial Drone / Aircraft Pilot",
        description: "Manages remote drone fleets for geological surveying, infrastructure mapping, or flies commercial aircraft routes.",
        outlook: "High Growth (Driven by cargo logistics and mineral mapping)",
        salaryRange: "₦350,000 - ₦1,200,000 / month",
        jssTrack: "technical",
        waecSubjects: [
          { subject: "Mathematics", minGrade: "C5" },
          { subject: "English Language", minGrade: "C6" },
          { subject: "Physics", minGrade: "C5" },
          { subject: "Geography", minGrade: "C6" }
        ],
        jambSubjects: ["English Language", "Mathematics", "Physics", "Chemistry"],
        skills: ["Flight Control", "Meteorology Reading", "Navigation Systems", "Hand-Eye Coordination"],
        alternativePathways: "University: B.Sc Meteorology or Aeronautical Science; Aviation School Pilot License.",
        vectors: {
          aptitudes: {
            numerical: { ideal: 0.70, weight: 0.10 },
            verbal: { ideal: 0.60, weight: 0.05 },
            abstract: { ideal: 0.80, weight: 0.20 },
            spatial: { ideal: 0.90, weight: 0.25 }
          },
          interests: {
            realistic: { ideal: 0.90, weight: 0.25 },
            investigative: { ideal: 0.70, weight: 0.10 },
            artistic: { ideal: 0.30, weight: 0.00 },
            social: { ideal: 0.50, weight: 0.05 },
            enterprising: { ideal: 0.70, weight: 0.10 },
            conventional: { ideal: 0.65, weight: 0.05 }
          },
          personality: {
            openness: { ideal: 0.70, weight: 0.05 },
            conscientiousness: { ideal: 0.85, weight: 0.20 },
            extraversion: { ideal: 0.60, weight: 0.05 },
            agreeableness: { ideal: 0.55, weight: 0.05 },
            stability: { ideal: 0.85, weight: 0.10 }
          },
          values: {
            independence: { ideal: 0.75, weight: 0.10 },
            achievement: { ideal: 0.85, weight: 0.15 },
            relationships: { ideal: 0.50, weight: 0.05 },
            support: { ideal: 0.65, weight: 0.05 }
          }
        }
      }
    ]
  },
  {
    id: "CL-VOCA",
    name: "Technical Crafts & Green Trades",
    description: "Hands-on electrical installations, smart grid integrations, custom mechanics, and infrastructure construction.",
    occupations: [
      {
        id: "OC-VOC-001",
        title: "Solar Installation Architect",
        description: "Designs, maps, and installs solar panel architectures and storage grids for homes, offices, and industrial hubs.",
        outlook: "Extremely High Growth (Driven by power supply deficits and green energy transitions)",
        salaryRange: "₦150,000 - ₦500,000 / month",
        jssTrack: "technical",
        waecSubjects: [
          { subject: "Mathematics", minGrade: "D7" },
          { subject: "Physics", minGrade: "C6" },
          { subject: "Chemistry", minGrade: "C6" }
        ],
        jambSubjects: ["English Language", "Mathematics", "Physics", "Chemistry"],
        skills: ["Electrical Wiring", "Spatial Installation", "Physical Safety", "Troubleshooting"],
        alternativePathways: "Polytechnic: National Diploma in Electrical Engineering; Vocational: NABTEB certifications, solar training programs.",
        vectors: {
          aptitudes: {
            numerical: { ideal: 0.60, weight: 0.10 },
            verbal: { ideal: 0.45, weight: 0.05 },
            abstract: { ideal: 0.65, weight: 0.15 },
            spatial: { ideal: 0.80, weight: 0.20 }
          },
          interests: {
            realistic: { ideal: 0.90, weight: 0.25 },
            investigative: { ideal: 0.65, weight: 0.10 },
            artistic: { ideal: 0.40, weight: 0.00 },
            social: { ideal: 0.50, weight: 0.05 },
            enterprising: { ideal: 0.60, weight: 0.10 },
            conventional: { ideal: 0.65, weight: 0.10 }
          },
          personality: {
            openness: { ideal: 0.65, weight: 0.05 },
            conscientiousness: { ideal: 0.80, weight: 0.20 },
            extraversion: { ideal: 0.45, weight: 0.05 },
            agreeableness: { ideal: 0.60, weight: 0.05 },
            stability: { ideal: 0.70, weight: 0.10 }
          },
          values: {
            independence: { ideal: 0.75, weight: 0.10 },
            achievement: { ideal: 0.80, weight: 0.15 },
            relationships: { ideal: 0.50, weight: 0.05 },
            support: { ideal: 0.60, weight: 0.05 }
          }
        }
      }
    ]
  }
];

export interface UniversityCourse {
  id: string;
  title: string;
  faculty: string;
  description: string;
  waecRequirements: AcademicPrereq[];
  jambCompulsory: string[]; // Compulsory subjects in JAMB
  jambOptions: string[]; // Eligible elective choices
  vectors: CareerVectors;
}

export const UNIVERSITY_COURSES: UniversityCourse[] = [
  {
    id: "UNIV-MED",
    title: "Medicine & Surgery",
    faculty: "Clinical Sciences",
    description: "Training professional medical practitioners to diagnose, treat, and prevent human illnesses and diseases.",
    waecRequirements: [
      { subject: "English Language", minGrade: "C6" },
      { subject: "Mathematics", minGrade: "C6" },
      { subject: "Physics", minGrade: "C5" },
      { subject: "Chemistry", minGrade: "C5" },
      { subject: "Biology", minGrade: "C5" }
    ],
    jambCompulsory: ["English Language", "Biology", "Chemistry", "Physics"],
    jambOptions: [],
    vectors: {
      aptitudes: {
        numerical: { ideal: 0.70, weight: 0.10 },
        verbal: { ideal: 0.75, weight: 0.15 },
        abstract: { ideal: 0.80, weight: 0.15 },
        spatial: { ideal: 0.60, weight: 0.05 }
      },
      interests: {
        realistic: { ideal: 0.50, weight: 0.05 },
        investigative: { ideal: 0.90, weight: 0.25 },
        artistic: { ideal: 0.35, weight: 0.00 },
        social: { ideal: 0.85, weight: 0.20 },
        enterprising: { ideal: 0.60, weight: 0.05 },
        conventional: { ideal: 0.75, weight: 0.10 }
      },
      personality: {
        openness: { ideal: 0.70, weight: 0.05 },
        conscientiousness: { ideal: 0.90, weight: 0.20 },
        extraversion: { ideal: 0.55, weight: 0.05 },
        agreeableness: { ideal: 0.80, weight: 0.10 },
        stability: { ideal: 0.85, weight: 0.10 }
      },
      values: {
        independence: { ideal: 0.60, weight: 0.05 },
        achievement: { ideal: 0.85, weight: 0.15 },
        relationships: { ideal: 0.80, weight: 0.15 },
        support: { ideal: 0.75, weight: 0.05 }
      }
    }
  },
  {
    id: "UNIV-PHA",
    title: "Pharmacy",
    faculty: "Pharmacy",
    description: "Dispensing pharmaceuticals, drug composition study, and clinical chemical therapies.",
    waecRequirements: [
      { subject: "English Language", minGrade: "C6" },
      { subject: "Mathematics", minGrade: "C6" },
      { subject: "Physics", minGrade: "C6" },
      { subject: "Chemistry", minGrade: "C5" },
      { subject: "Biology", minGrade: "C6" }
    ],
    jambCompulsory: ["English Language", "Biology", "Chemistry", "Physics"],
    jambOptions: [],
    vectors: {
      aptitudes: {
        numerical: { ideal: 0.75, weight: 0.15 },
        verbal: { ideal: 0.70, weight: 0.10 },
        abstract: { ideal: 0.75, weight: 0.15 },
        spatial: { ideal: 0.50, weight: 0.00 }
      },
      interests: {
        realistic: { ideal: 0.45, weight: 0.05 },
        investigative: { ideal: 0.85, weight: 0.20 },
        artistic: { ideal: 0.30, weight: 0.00 },
        social: { ideal: 0.75, weight: 0.15 },
        enterprising: { ideal: 0.60, weight: 0.10 },
        conventional: { ideal: 0.80, weight: 0.20 }
      },
      personality: {
        openness: { ideal: 0.65, weight: 0.05 },
        conscientiousness: { ideal: 0.85, weight: 0.15 },
        extraversion: { ideal: 0.50, weight: 0.05 },
        agreeableness: { ideal: 0.75, weight: 0.05 },
        stability: { ideal: 0.80, weight: 0.10 }
      },
      values: {
        independence: { ideal: 0.70, weight: 0.10 },
        achievement: { ideal: 0.80, weight: 0.15 },
        relationships: { ideal: 0.75, weight: 0.05 },
        support: { ideal: 0.70, weight: 0.05 }
      }
    }
  },
  {
    id: "UNIV-NUR",
    title: "Nursing Science",
    faculty: "Health Sciences",
    description: "Patient healthcare administration, clinical routines support, and primary community therapeutics.",
    waecRequirements: [
      { subject: "English Language", minGrade: "C5" },
      { subject: "Mathematics", minGrade: "C6" },
      { subject: "Biology", minGrade: "C5" },
      { subject: "Chemistry", minGrade: "C6" },
      { subject: "Physics", minGrade: "C6" }
    ],
    jambCompulsory: ["English Language", "Biology", "Chemistry", "Physics"],
    jambOptions: [],
    vectors: {
      aptitudes: {
        numerical: { ideal: 0.60, weight: 0.10 },
        verbal: { ideal: 0.80, weight: 0.20 },
        abstract: { ideal: 0.70, weight: 0.10 },
        spatial: { ideal: 0.50, weight: 0.00 }
      },
      interests: {
        realistic: { ideal: 0.40, weight: 0.05 },
        investigative: { ideal: 0.70, weight: 0.10 },
        artistic: { ideal: 0.45, weight: 0.05 },
        social: { ideal: 0.90, weight: 0.25 },
        enterprising: { ideal: 0.55, weight: 0.05 },
        conventional: { ideal: 0.75, weight: 0.10 }
      },
      personality: {
        openness: { ideal: 0.65, weight: 0.05 },
        conscientiousness: { ideal: 0.85, weight: 0.20 },
        extraversion: { ideal: 0.70, weight: 0.10 },
        agreeableness: { ideal: 0.85, weight: 0.10 },
        stability: { ideal: 0.80, weight: 0.10 }
      },
      values: {
        independence: { ideal: 0.55, weight: 0.05 },
        achievement: { ideal: 0.80, weight: 0.15 },
        relationships: { ideal: 0.85, weight: 0.15 },
        support: { ideal: 0.75, weight: 0.05 }
      }
    }
  },
  {
    id: "UNIV-CSE",
    title: "Computer Engineering",
    faculty: "Engineering & Technology",
    description: "Designing, building, and maintaining hardware-software architectures, embedded systems, and digital networks.",
    waecRequirements: [
      { subject: "English Language", minGrade: "C6" },
      { subject: "Mathematics", minGrade: "C5" },
      { subject: "Physics", minGrade: "C5" },
      { subject: "Chemistry", minGrade: "C6" }
    ],
    jambCompulsory: ["English Language", "Mathematics", "Physics", "Chemistry"],
    jambOptions: [],
    vectors: {
      aptitudes: {
        numerical: { ideal: 0.85, weight: 0.20 },
        verbal: { ideal: 0.60, weight: 0.10 },
        abstract: { ideal: 0.85, weight: 0.20 },
        spatial: { ideal: 0.70, weight: 0.10 }
      },
      interests: {
        realistic: { ideal: 0.80, weight: 0.20 },
        investigative: { ideal: 0.85, weight: 0.20 },
        artistic: { ideal: 0.40, weight: 0.00 },
        social: { ideal: 0.45, weight: 0.05 },
        enterprising: { ideal: 0.60, weight: 0.05 },
        conventional: { ideal: 0.70, weight: 0.10 }
      },
      personality: {
        openness: { ideal: 0.75, weight: 0.10 },
        conscientiousness: { ideal: 0.80, weight: 0.15 },
        extraversion: { ideal: 0.45, weight: 0.05 },
        agreeableness: { ideal: 0.55, weight: 0.05 },
        stability: { ideal: 0.75, weight: 0.05 }
      },
      values: {
        independence: { ideal: 0.75, weight: 0.10 },
        achievement: { ideal: 0.85, weight: 0.15 },
        relationships: { ideal: 0.50, weight: 0.05 },
        support: { ideal: 0.65, weight: 0.05 }
      }
    }
  },
  {
    id: "UNIV-MCE",
    title: "Mechanical Engineering",
    faculty: "Engineering",
    description: "Design of dynamic engines, logistics machines, mechanical works, and material fatigue stresses.",
    waecRequirements: [
      { subject: "English Language", minGrade: "C6" },
      { subject: "Mathematics", minGrade: "C5" },
      { subject: "Physics", minGrade: "C5" },
      { subject: "Chemistry", minGrade: "C6" }
    ],
    jambCompulsory: ["English Language", "Mathematics", "Physics", "Chemistry"],
    jambOptions: [],
    vectors: {
      aptitudes: {
        numerical: { ideal: 0.85, weight: 0.20 },
        verbal: { ideal: 0.55, weight: 0.05 },
        abstract: { ideal: 0.80, weight: 0.20 },
        spatial: { ideal: 0.85, weight: 0.20 }
      },
      interests: {
        realistic: { ideal: 0.90, weight: 0.25 },
        investigative: { ideal: 0.80, weight: 0.20 },
        artistic: { ideal: 0.35, weight: 0.00 },
        social: { ideal: 0.40, weight: 0.05 },
        enterprising: { ideal: 0.60, weight: 0.10 },
        conventional: { ideal: 0.65, weight: 0.05 }
      },
      personality: {
        openness: { ideal: 0.70, weight: 0.05 },
        conscientiousness: { ideal: 0.80, weight: 0.15 },
        extraversion: { ideal: 0.45, weight: 0.05 },
        agreeableness: { ideal: 0.55, weight: 0.05 },
        stability: { ideal: 0.75, weight: 0.10 }
      },
      values: {
        independence: { ideal: 0.70, weight: 0.10 },
        achievement: { ideal: 0.80, weight: 0.15 },
        relationships: { ideal: 0.50, weight: 0.05 },
        support: { ideal: 0.65, weight: 0.05 }
      }
    }
  },
  {
    id: "UNIV-CVE",
    title: "Civil Engineering",
    faculty: "Engineering",
    description: "Designing concrete structures, physical roads, bridge spans, and civil distribution architectures.",
    waecRequirements: [
      { subject: "English Language", minGrade: "C6" },
      { subject: "Mathematics", minGrade: "C5" },
      { subject: "Physics", minGrade: "C5" },
      { subject: "Chemistry", minGrade: "C6" }
    ],
    jambCompulsory: ["English Language", "Mathematics", "Physics", "Chemistry"],
    jambOptions: [],
    vectors: {
      aptitudes: {
        numerical: { ideal: 0.80, weight: 0.15 },
        verbal: { ideal: 0.60, weight: 0.10 },
        abstract: { ideal: 0.80, weight: 0.15 },
        spatial: { ideal: 0.90, weight: 0.25 }
      },
      interests: {
        realistic: { ideal: 0.85, weight: 0.20 },
        investigative: { ideal: 0.75, weight: 0.15 },
        artistic: { ideal: 0.45, weight: 0.05 },
        social: { ideal: 0.50, weight: 0.05 },
        enterprising: { ideal: 0.65, weight: 0.10 },
        conventional: { ideal: 0.70, weight: 0.10 }
      },
      personality: {
        openness: { ideal: 0.70, weight: 0.05 },
        conscientiousness: { ideal: 0.85, weight: 0.20 },
        extraversion: { ideal: 0.50, weight: 0.05 },
        agreeableness: { ideal: 0.60, weight: 0.05 },
        stability: { ideal: 0.75, weight: 0.05 }
      },
      values: {
        independence: { ideal: 0.70, weight: 0.10 },
        achievement: { ideal: 0.85, weight: 0.15 },
        relationships: { ideal: 0.55, weight: 0.05 },
        support: { ideal: 0.65, weight: 0.05 }
      }
    }
  },
  {
    id: "UNIV-CSC",
    title: "Computer Science",
    faculty: "Sciences",
    description: "Theoretical computation algorithms, database logic, AI programming, and cloud networks design.",
    waecRequirements: [
      { subject: "English Language", minGrade: "C6" },
      { subject: "Mathematics", minGrade: "C5" },
      { subject: "Physics", minGrade: "C6" },
      { subject: "Chemistry", minGrade: "C6" }
    ],
    jambCompulsory: ["English Language", "Mathematics", "Physics"],
    jambOptions: ["Chemistry", "Biology", "Economics"],
    vectors: {
      aptitudes: {
        numerical: { ideal: 0.85, weight: 0.20 },
        verbal: { ideal: 0.60, weight: 0.10 },
        abstract: { ideal: 0.85, weight: 0.20 },
        spatial: { ideal: 0.55, weight: 0.05 }
      },
      interests: {
        realistic: { ideal: 0.55, weight: 0.10 },
        investigative: { ideal: 0.90, weight: 0.25 },
        artistic: { ideal: 0.40, weight: 0.00 },
        social: { ideal: 0.45, weight: 0.05 },
        enterprising: { ideal: 0.50, weight: 0.05 },
        conventional: { ideal: 0.75, weight: 0.15 }
      },
      personality: {
        openness: { ideal: 0.75, weight: 0.10 },
        conscientiousness: { ideal: 0.80, weight: 0.15 },
        extraversion: { ideal: 0.40, weight: 0.05 },
        agreeableness: { ideal: 0.55, weight: 0.05 },
        stability: { ideal: 0.70, weight: 0.05 }
      },
      values: {
        independence: { ideal: 0.80, weight: 0.15 },
        achievement: { ideal: 0.85, weight: 0.15 },
        relationships: { ideal: 0.50, weight: 0.05 },
        support: { ideal: 0.60, weight: 0.05 }
      }
    }
  },
  {
    id: "UNIV-CYS",
    title: "Cybersecurity",
    faculty: "Computing",
    description: "Protection of digital systems, malware vulnerability check, network penetration logs, and cyber threat metrics.",
    waecRequirements: [
      { subject: "English Language", minGrade: "C6" },
      { subject: "Mathematics", minGrade: "C5" },
      { subject: "Physics", minGrade: "C6" },
      { subject: "Chemistry", minGrade: "C6" }
    ],
    jambCompulsory: ["English Language", "Mathematics", "Physics"],
    jambOptions: ["Chemistry", "Biology", "Economics"],
    vectors: {
      aptitudes: {
        numerical: { ideal: 0.80, weight: 0.15 },
        verbal: { ideal: 0.65, weight: 0.10 },
        abstract: { ideal: 0.85, weight: 0.20 },
        spatial: { ideal: 0.60, weight: 0.10 }
      },
      interests: {
        realistic: { ideal: 0.65, weight: 0.15 },
        investigative: { ideal: 0.85, weight: 0.20 },
        artistic: { ideal: 0.35, weight: 0.00 },
        social: { ideal: 0.45, weight: 0.05 },
        enterprising: { ideal: 0.55, weight: 0.05 },
        conventional: { ideal: 0.80, weight: 0.20 }
      },
      personality: {
        openness: { ideal: 0.70, weight: 0.05 },
        conscientiousness: { ideal: 0.85, weight: 0.20 },
        extraversion: { ideal: 0.40, weight: 0.05 },
        agreeableness: { ideal: 0.55, weight: 0.05 },
        stability: { ideal: 0.80, weight: 0.10 }
      },
      values: {
        independence: { ideal: 0.80, weight: 0.15 },
        achievement: { ideal: 0.80, weight: 0.15 },
        relationships: { ideal: 0.50, weight: 0.05 },
        support: { ideal: 0.70, weight: 0.05 }
      }
    }
  },
  {
    id: "UNIV-LAW",
    title: "Law (LL.B.)",
    faculty: "Law",
    description: "Comprehensive study of jurisprudence, corporate legal frameworks, criminal justice, and advocacy.",
    waecRequirements: [
      { subject: "English Language", minGrade: "C5" },
      { subject: "Literature-in-English", minGrade: "C5" },
      { subject: "Mathematics", minGrade: "D7" },
      { subject: "Government", minGrade: "C6" }
    ],
    jambCompulsory: ["English Language", "Literature-in-English", "Government"],
    jambOptions: ["Christian Religious Studies", "Islamic Studies", "Economics"],
    vectors: {
      aptitudes: {
        numerical: { ideal: 0.45, weight: 0.05 },
        verbal: { ideal: 0.90, weight: 0.25 },
        abstract: { ideal: 0.75, weight: 0.15 },
        spatial: { ideal: 0.40, weight: 0.00 }
      },
      interests: {
        realistic: { ideal: 0.30, weight: 0.00 },
        investigative: { ideal: 0.80, weight: 0.15 },
        artistic: { ideal: 0.60, weight: 0.05 },
        social: { ideal: 0.75, weight: 0.15 },
        enterprising: { ideal: 0.85, weight: 0.20 },
        conventional: { ideal: 0.65, weight: 0.05 }
      },
      personality: {
        openness: { ideal: 0.80, weight: 0.10 },
        conscientiousness: { ideal: 0.85, weight: 0.15 },
        extraversion: { ideal: 0.80, weight: 0.15 },
        agreeableness: { ideal: 0.60, weight: 0.05 },
        stability: { ideal: 0.75, weight: 0.05 }
      },
      values: {
        independence: { ideal: 0.80, weight: 0.15 },
        achievement: { ideal: 0.85, weight: 0.15 },
        relationships: { ideal: 0.60, weight: 0.05 },
        support: { ideal: 0.60, weight: 0.05 }
      }
    }
  },
  {
    id: "UNIV-ACC",
    title: "Accounting",
    faculty: "Administration / Management",
    description: "Financial accounting audits, management ledger calculations, corporate taxation, and business budgeting.",
    waecRequirements: [
      { subject: "English Language", minGrade: "C6" },
      { subject: "Mathematics", minGrade: "C6" },
      { subject: "Economics", minGrade: "C5" }
    ],
    jambCompulsory: ["English Language", "Mathematics", "Economics"],
    jambOptions: ["Financial Accounting", "Commerce", "Government"],
    vectors: {
      aptitudes: {
        numerical: { ideal: 0.85, weight: 0.20 },
        verbal: { ideal: 0.70, weight: 0.15 },
        abstract: { ideal: 0.70, weight: 0.10 },
        spatial: { ideal: 0.40, weight: 0.00 }
      },
      interests: {
        realistic: { ideal: 0.35, weight: 0.00 },
        investigative: { ideal: 0.65, weight: 0.10 },
        artistic: { ideal: 0.30, weight: 0.00 },
        social: { ideal: 0.50, weight: 0.05 },
        enterprising: { ideal: 0.75, weight: 0.15 },
        conventional: { ideal: 0.90, weight: 0.25 }
      },
      personality: {
        openness: { ideal: 0.55, weight: 0.05 },
        conscientiousness: { ideal: 0.90, weight: 0.20 },
        extraversion: { ideal: 0.60, weight: 0.05 },
        agreeableness: { ideal: 0.55, weight: 0.05 },
        stability: { ideal: 0.75, weight: 0.05 }
      },
      values: {
        independence: { ideal: 0.60, weight: 0.05 },
        achievement: { ideal: 0.80, weight: 0.15 },
        relationships: { ideal: 0.50, weight: 0.05 },
        support: { ideal: 0.75, weight: 0.10 }
      }
    }
  },
  {
    id: "UNIV-BUS",
    title: "Business Administration",
    faculty: "Administration",
    description: "Strategic corporate leadership, marketing structures, business management principles, and operations.",
    waecRequirements: [
      { subject: "English Language", minGrade: "C6" },
      { subject: "Mathematics", minGrade: "C6" },
      { subject: "Economics", minGrade: "C6" }
    ],
    jambCompulsory: ["English Language", "Mathematics", "Economics"],
    jambOptions: ["Commerce", "Financial Accounting", "Government"],
    vectors: {
      aptitudes: {
        numerical: { ideal: 0.70, weight: 0.10 },
        verbal: { ideal: 0.80, weight: 0.20 },
        abstract: { ideal: 0.70, weight: 0.10 },
        spatial: { ideal: 0.45, weight: 0.00 }
      },
      interests: {
        realistic: { ideal: 0.30, weight: 0.00 },
        investigative: { ideal: 0.60, weight: 0.10 },
        artistic: { ideal: 0.40, weight: 0.00 },
        social: { ideal: 0.60, weight: 0.05 },
        enterprising: { ideal: 0.90, weight: 0.25 },
        conventional: { ideal: 0.75, weight: 0.15 }
      },
      personality: {
        openness: { ideal: 0.70, weight: 0.05 },
        conscientiousness: { ideal: 0.80, weight: 0.15 },
        extraversion: { ideal: 0.85, weight: 0.20 },
        agreeableness: { ideal: 0.65, weight: 0.05 },
        stability: { ideal: 0.75, weight: 0.05 }
      },
      values: {
        independence: { ideal: 0.70, weight: 0.05 },
        achievement: { ideal: 0.85, weight: 0.15 },
        relationships: { ideal: 0.60, weight: 0.05 },
        support: { ideal: 0.70, weight: 0.05 }
      }
    }
  },
  {
    id: "UNIV-MCO",
    title: "Mass Communication",
    faculty: "Social Sciences",
    description: "Broadcast journalism, public relations campaigns, content writing, and digital media dynamics.",
    waecRequirements: [
      { subject: "English Language", minGrade: "C5" },
      { subject: "Literature-in-English", minGrade: "C6" },
      { subject: "Mathematics", minGrade: "D7" }
    ],
    jambCompulsory: ["English Language", "Literature-in-English", "Government"],
    jambOptions: ["Christian Religious Studies", "Islamic Studies", "Economics", "History"],
    vectors: {
      aptitudes: {
        numerical: { ideal: 0.40, weight: 0.00 },
        verbal: { ideal: 0.85, weight: 0.25 },
        abstract: { ideal: 0.70, weight: 0.10 },
        spatial: { ideal: 0.50, weight: 0.05 }
      },
      interests: {
        realistic: { ideal: 0.30, weight: 0.00 },
        investigative: { ideal: 0.55, weight: 0.10 },
        artistic: { ideal: 0.85, weight: 0.20 },
        social: { ideal: 0.75, weight: 0.15 },
        enterprising: { ideal: 0.80, weight: 0.20 },
        conventional: { ideal: 0.45, weight: 0.00 }
      },
      personality: {
        openness: { ideal: 0.85, weight: 0.15 },
        conscientiousness: { ideal: 0.70, weight: 0.10 },
        extraversion: { ideal: 0.80, weight: 0.15 },
        agreeableness: { ideal: 0.70, weight: 0.05 },
        stability: { ideal: 0.65, weight: 0.05 }
      },
      values: {
        independence: { ideal: 0.75, weight: 0.10 },
        achievement: { ideal: 0.80, weight: 0.15 },
        relationships: { ideal: 0.70, weight: 0.05 },
        support: { ideal: 0.60, weight: 0.05 }
      }
    }
  },
  {
    id: "UNIV-EDT",
    title: "Educational Technology",
    faculty: "Education",
    description: "Pedagogy principles combined with digital learning infrastructure planning.",
    waecRequirements: [
      { subject: "English Language", minGrade: "C6" },
      { subject: "Mathematics", minGrade: "C6" },
      { subject: "Physics", minGrade: "C6" }
    ],
    jambCompulsory: ["English Language", "Mathematics", "Physics"],
    jambOptions: ["Chemistry", "Biology", "Economics", "Geography"],
    vectors: {
      aptitudes: {
        numerical: { ideal: 0.65, weight: 0.10 },
        verbal: { ideal: 0.80, weight: 0.20 },
        abstract: { ideal: 0.70, weight: 0.10 },
        spatial: { ideal: 0.50, weight: 0.00 }
      },
      interests: {
        realistic: { ideal: 0.35, weight: 0.00 },
        investigative: { ideal: 0.65, weight: 0.10 },
        artistic: { ideal: 0.50, weight: 0.05 },
        social: { ideal: 0.90, weight: 0.25 },
        enterprising: { ideal: 0.60, weight: 0.10 },
        conventional: { ideal: 0.65, weight: 0.10 }
      },
      personality: {
        openness: { ideal: 0.80, weight: 0.10 },
        conscientiousness: { ideal: 0.80, weight: 0.15 },
        extraversion: { ideal: 0.70, weight: 0.10 },
        agreeableness: { ideal: 0.85, weight: 0.10 },
        stability: { ideal: 0.75, weight: 0.05 }
      },
      values: {
        independence: { ideal: 0.60, weight: 0.05 },
        achievement: { ideal: 0.80, weight: 0.15 },
        relationships: { ideal: 0.90, weight: 0.20 },
        support: { ideal: 0.75, weight: 0.05 }
      }
    }
  },
  {
    id: "UNIV-AGEC",
    title: "Agricultural Economics",
    faculty: "Agriculture",
    description: "Applying economic and management principles to agricultural markets, food distribution networks, and policy.",
    waecRequirements: [
      { subject: "English Language", minGrade: "C6" },
      { subject: "Mathematics", minGrade: "C6" },
      { subject: "Agricultural Science", minGrade: "C5" },
      { subject: "Chemistry", minGrade: "C6" }
    ],
    jambCompulsory: ["English Language", "Chemistry", "Biology"],
    jambOptions: ["Agricultural Science", "Mathematics", "Physics", "Economics", "Geography"],
    vectors: {
      aptitudes: {
        numerical: { ideal: 0.70, weight: 0.15 },
        verbal: { ideal: 0.65, weight: 0.10 },
        abstract: { ideal: 0.70, weight: 0.15 },
        spatial: { ideal: 0.55, weight: 0.05 }
      },
      interests: {
        realistic: { ideal: 0.75, weight: 0.15 },
        investigative: { ideal: 0.75, weight: 0.15 },
        artistic: { ideal: 0.35, weight: 0.00 },
        social: { ideal: 0.60, weight: 0.10 },
        enterprising: { ideal: 0.70, weight: 0.10 },
        conventional: { ideal: 0.65, weight: 0.05 }
      },
      personality: {
        openness: { ideal: 0.65, weight: 0.05 },
        conscientiousness: { ideal: 0.80, weight: 0.15 },
        extraversion: { ideal: 0.50, weight: 0.05 },
        agreeableness: { ideal: 0.60, weight: 0.05 },
        stability: { ideal: 0.70, weight: 0.05 }
      },
      values: {
        independence: { ideal: 0.70, weight: 0.10 },
        achievement: { ideal: 0.80, weight: 0.15 },
        relationships: { ideal: 0.60, weight: 0.05 },
        support: { ideal: 0.65, weight: 0.05 }
      }
    }
  },
  {
    id: "UNIV-AVS",
    title: "Aeronautical Science",
    faculty: "Science / Engineering",
    description: "Study of aviation control systems, aerodynamic structures, flight physics, and weather metrics.",
    waecRequirements: [
      { subject: "English Language", minGrade: "C6" },
      { subject: "Mathematics", minGrade: "C5" },
      { subject: "Physics", minGrade: "C5" },
      { subject: "Chemistry", minGrade: "C6" }
    ],
    jambCompulsory: ["English Language", "Mathematics", "Physics"],
    jambOptions: ["Chemistry", "Geography"],
    vectors: {
      aptitudes: {
        numerical: { ideal: 0.75, weight: 0.15 },
        verbal: { ideal: 0.60, weight: 0.05 },
        abstract: { ideal: 0.80, weight: 0.20 },
        spatial: { ideal: 0.90, weight: 0.25 }
      },
      interests: {
        realistic: { ideal: 0.90, weight: 0.25 },
        investigative: { ideal: 0.70, weight: 0.10 },
        artistic: { ideal: 0.30, weight: 0.00 },
        social: { ideal: 0.50, weight: 0.05 },
        enterprising: { ideal: 0.70, weight: 0.10 },
        conventional: { ideal: 0.65, weight: 0.05 }
      },
      personality: {
        openness: { ideal: 0.70, weight: 0.05 },
        conscientiousness: { ideal: 0.85, weight: 0.20 },
        extraversion: { ideal: 0.60, weight: 0.05 },
        agreeableness: { ideal: 0.55, weight: 0.05 },
        stability: { ideal: 0.85, weight: 0.10 }
      },
      values: {
        independence: { ideal: 0.75, weight: 0.10 },
        achievement: { ideal: 0.85, weight: 0.15 },
        relationships: { ideal: 0.50, weight: 0.05 },
        support: { ideal: 0.65, weight: 0.05 }
      }
    }
  }
];
