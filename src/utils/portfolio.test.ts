import test from 'node:test';
import assert from 'node:assert/strict';
import { getMissionPhaseFromProgress, validateContactForm, getProjectById, filterSkillsByCategory, MISSION_PHASES } from './portfolioUtils';

test('getMissionPhaseFromProgress returns correct scene for scroll ratios', () => {
  assert.equal(getMissionPhaseFromProgress(0.0).code, 'SCENE_01');
  assert.equal(getMissionPhaseFromProgress(0.2).code, 'SCENE_02');
  assert.equal(getMissionPhaseFromProgress(0.4).code, 'SCENE_03');
  assert.equal(getMissionPhaseFromProgress(0.6).code, 'SCENE_04');
  assert.equal(getMissionPhaseFromProgress(0.8).code, 'SCENE_05');
  assert.equal(getMissionPhaseFromProgress(0.95).code, 'SCENE_06');
});

test('validateContactForm correctly identifies valid and invalid payloads', () => {
  const invalidResult = validateContactForm({ name: '', email: 'invalid-email', subject: 'hi', message: 'short' });
  assert.equal(invalidResult.isValid, false);
  assert.ok(invalidResult.errors.name);
  assert.ok(invalidResult.errors.email);
  assert.ok(invalidResult.errors.subject);
  assert.ok(invalidResult.errors.message);

  const validResult = validateContactForm({
    name: 'Sarah Connor',
    email: 'sarah@example.com',
    subject: 'Full Stack Engineering Inquiry',
    message: 'We are interested in discussing an engineering role for Badri.'
  });
  assert.equal(validResult.isValid, true);
  assert.equal(Object.keys(validResult.errors).length, 0);
});

test('getProjectById retrieves flagship project and IDE project', () => {
  const docProject = getProjectById('intelligent-document-processing');
  assert.ok(docProject);
  assert.equal(docProject?.isFlagship, true);

  const ideProject = getProjectById('b-code-ide');
  assert.ok(ideProject);
  assert.equal(ideProject?.isFlagship, false);
});

test('filterSkillsByCategory filters skills correctly', () => {
  const langSkills = filterSkillsByCategory('A');
  assert.ok(langSkills.length > 0);
  assert.equal(langSkills[0].category, 'Languages');

  const allSkills = filterSkillsByCategory('ALL');
  assert.ok(allSkills.length >= 20);
});
