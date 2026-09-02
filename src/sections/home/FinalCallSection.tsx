import React from 'react';
import { Section } from '@/components/layout/Section';
import { Container } from '@/components/layout/Container';
import { Heading } from '@/components/typography/Heading';
import { Text } from '@/components/typography/Text';
import Link from 'next/link';

export function FinalCallSection() {
  return (
    <Section className="bg-surface py-12">
 <Container size="wide" className="text-center">
 <Heading as="h2" variant="heading-1" className="text-foreground mb-4">
 Da intenção ao espaço construído.
 </Heading>
 <Text variant="body-lg" className="text-muted mb-8 max-w-2xl mx-auto">
 Explore como nossa abordagem combina arquitetura e engenharia para criar ambientes únicos.
 </Text>
 <Link href="#contact" className="inline-block bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90 transition-colors">
 Entre em contato
 </Link>
 </Container>
 </Section>
 );
}
