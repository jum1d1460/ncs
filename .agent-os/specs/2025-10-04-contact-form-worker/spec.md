# Spec Requirements Document

> Spec: Worker de Cloudflare para Formulario de Contacto
> Created: 2025-10-04

## Overview

Desarrollo de un worker de Cloudflare que procese los datos del formulario de contacto de la web de NCS Psicóloga, enviando notificaciones por email y almacenando los datos en Supabase para reducir la carga del servidor y mejorar la escalabilidad del sistema de contacto.

## User Stories

### Visitor submitting contact form

As a potential client visiting the NCS Psicóloga website, I want to submit a contact form with my information and message, so that I can request a consultation or ask questions about psychological services.

When a visitor fills out the contact form with their name, email, phone (optional), subject, message, and contact preference, the system validates the data, sends an email notification to the psychologist, stores the submission in a database for record-keeping, and provides immediate feedback to the user about the successful submission or any errors.

### Psychologist receiving contact notifications

As a psychologist (Nelly), I want to receive email notifications when someone submits the contact form, so that I can respond promptly to potential clients and provide excellent customer service.

The system sends a well-formatted email with all the contact details, including name, email, phone, subject, message, contact preference, timestamp, and IP address. The email allows direct reply to the client's email address for easy communication.

### Administrator reviewing submissions

As an administrator, I want all contact form submissions stored in a database, so that I can review submission history, track response status, and analyze contact patterns over time.

All submissions are stored in Supabase with full details and metadata, including timestamps, IP addresses, and user agents. The data can be queried, filtered by status (new, read, replied, archived), and used for analytics and compliance purposes.

## Spec Scope

1. **Worker de Cloudflare** - Endpoint POST que recibe datos del formulario, valida la información, y procesa las solicitudes con rate limiting y seguridad CORS.

2. **Servicio de Email** - Integración con Resend para enviar notificaciones automáticas a la psicóloga con toda la información del contacto en formato HTML profesional.

3. **Integración con Supabase** - Almacenamiento de todas las solicitudes en una tabla `contact_submissions` con campos completos, índices optimizados, y políticas RLS configuradas.

4. **Validación y Seguridad** - Validación robusta de todos los campos del formulario usando Zod, sanitización de inputs, protección contra spam, y rate limiting por IP.

5. **Integración Frontend** - Actualización del componente ContactCTA.astro para enviar datos al worker vía AJAX con manejo de respuestas y feedback visual al usuario.

## Out of Scope

- Autenticación de usuarios en el frontend
- Dashboard administrativo para gestionar submissions (se puede hacer directamente en Supabase)
- Respuestas automáticas por email al usuario
- Integración con CRM o sistemas de terceros
- Envío de SMS o notificaciones push
- Funcionalidad de chat en tiempo real

## Expected Deliverable

1. Worker de Cloudflare desplegado y funcionando en `https://contact-form.ncs-psicologa.workers.dev/api/contact` que acepta POST requests, valida datos, envía emails, y almacena en Supabase.

2. Tabla `contact_submissions` creada en Supabase con esquema completo, índices, y políticas RLS configuradas correctamente.

3. Formulario de contacto en la web actualizado para enviar datos al worker vía AJAX con feedback visual (mensajes de éxito/error) y validación del lado del cliente.

