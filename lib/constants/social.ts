export interface SocialLink {
  name: string;
  url: string;
  icon: string;
  active: boolean;
}

export const SOCIAL_LINKS: SocialLink[] = [
  {
    name: 'Twitter',
    url: 'https://twitter.com/subsy',
    icon: 'twitter',
    active: true, // Set to true when Twitter account is active
  },
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/company/subsy-tech',
    icon: 'linkedin',
    active: true, // Set to true when LinkedIn account is active
  },
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/subsy',
    icon: 'instagram',
    active: true, // Set to true when Instagram account is active
  },
];

