(function () {
  'use strict';

  const navbar = document.querySelector('.navbar');
  if (navbar) {
    function onScroll() {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ----- Smooth scroll for navbar -----
  document.querySelectorAll('.nav-links a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const id = this.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ----- Animated Language Select -----
  const langTrigger = document.getElementById('langTrigger');
  const langDropdown = document.getElementById('langDropdown');
  const langCurrent = document.querySelector('.lang-current');
  const langOptions = document.querySelectorAll('.lang-option');
  const langSelectNative = document.getElementById('langSelect');

  // ----- Translations -----
  const translations = {
    en: {
      'nav.breaking': 'Breaking',
      'nav.threatIntel': 'Threat Intel',
      'nav.malware': 'Malware',
      'nav.apt': 'APT',
      'nav.breaches': 'Breaches',
      'nav.pentest': 'Pentest',
      'nav.bugBounty': 'Bug Bounty',
      'nav.more': 'More',
      'more.deepDives': 'Deep Dives',
      'more.beginner': 'Beginner',
      'more.research': 'Research',
      'more.darkWeb': 'Dark Web',
      'badge.breaking': 'BREAKING',
      'filters.vendorNeutral': 'Vendor-neutral only',
      'filters.time.label': 'Last 24h',
      'filters.time.lastHour': 'Last hour',
      'filters.time.last24h': 'Last 24h',
      'filters.time.last7d': 'Last 7 days',
      'filters.time.last30d': 'Last 30 days',
      'filters.time.all': 'All time',
      'filters.type.label': 'News',
      'filters.type.news': 'News',
      'filters.type.analysis': 'Analysis',
      'filters.type.report': 'Report',
      'filters.type.advisory': 'Advisory',
      'filters.sources.label': 'Sources',
      'filters.sources.all': 'All Sources',
      'filters.sources.news': 'News',
      'filters.sources.analysis': 'Analysis',
      'filters.sources.report': 'Report',
      'filters.sources.advisory': 'Advisory',
      'sections.latestNews': 'Latest Security News',
      'sections.aptTitle': 'APT & Advanced Threats',
      'sections.aptDesc': 'Analysis and reports on advanced persistent threat groups.',
      'sections.breachesTitle': 'Data Breaches',
      'sections.breachesDesc': 'Tracking major data breach incidents and disclosures.',
      'sections.pentestTitle': 'Penetration Testing',
      'sections.pentestDesc': 'Tools, methodologies, and pentest news.',
      'sections.bountyTitle': 'Bug Bounty',
      'sections.bountyDesc': 'Program updates and vulnerability disclosures.',
      'sections.moreTitle': 'More',
      'sections.moreDesc': 'Additional resources and categories.',
      'sidebar.newsletterTitle': 'Newsletter',
      'sidebar.newsletterText': 'Get daily or weekly security digests delivered to your inbox.',
      'sidebar.daily': 'Daily',
      'sidebar.weekly': 'Weekly',
      'sidebar.newsletterDisclaimer': 'By subscribing, you agree to our privacy policy. Unsubscribe anytime.',
      "sidebar.digestTitle": "Today's Digest",
      'sidebar.digestItem1': 'Critical VPN zero-day under active exploitation',
      'sidebar.digestItem2': 'New ransomware variant targets healthcare sector',
      'sidebar.digestItem3': 'APT29 campaign linked to recent breaches',
      'sidebar.digestItem4': 'CISA releases emergency directive for federal agencies',
      'sidebar.digestItem5': 'Major bug bounty program doubles payouts',
      'tags.cve': 'CVE-2026-0001 (147)',
      'tags.ransomware': 'Ransomware (89)',
      'tags.apt29': 'APT29 (67)',
      'tags.zeroDay': 'Zero-Day (52)',
      'tags.supplyChain': 'Supply Chain (41)',
      'tags.cisa': 'CISA (38)',
      'loading.moreNews': 'Loading more news...',
      'card.read': 'Read',
      'search.placeholder': 'Search news, IOCs, actors'
    },
    es: {
      'nav.breaking': 'Últimas',
      'nav.threatIntel': 'Inteligencia de amenazas',
      'nav.malware': 'Malware',
      'nav.apt': 'APT',
      'nav.breaches': 'Filtraciones',
      'nav.pentest': 'Pentest',
      'nav.bugBounty': 'Bug bounty',
      'nav.more': 'Más',
      'more.deepDives': 'Análisis profundos',
      'more.beginner': 'Principiante',
      'more.research': 'Investigación',
      'more.darkWeb': 'Dark web',
      'badge.breaking': 'URGENTE',
      'filters.vendorNeutral': 'Solo contenido neutral',
      'filters.time.label': 'Últimas 24 h',
      'filters.time.lastHour': 'Última hora',
      'filters.time.last24h': 'Últimas 24 h',
      'filters.time.last7d': 'Últimos 7 días',
      'filters.time.last30d': 'Últimos 30 días',
      'filters.time.all': 'Todo el tiempo',
      'filters.type.label': 'Tipo',
      'filters.type.news': 'Noticias',
      'filters.type.analysis': 'Análisis',
      'filters.type.report': 'Informe',
      'filters.type.advisory': 'Aviso',
      'filters.sources.label': 'Fuentes',
      'filters.sources.all': 'Todas las fuentes',
      'filters.sources.news': 'Noticias',
      'filters.sources.analysis': 'Análisis',
      'filters.sources.report': 'Informes',
      'filters.sources.advisory': 'Avisos',
      'sections.latestNews': 'Últimas noticias de seguridad',
      'sections.aptTitle': 'APT y amenazas avanzadas',
      'sections.aptDesc': 'Análisis e informes sobre grupos APT.',
      'sections.breachesTitle': 'Filtraciones de datos',
      'sections.breachesDesc': 'Seguimiento de incidentes y filtraciones de datos.',
      'sections.pentestTitle': 'Pruebas de penetración',
      'sections.pentestDesc': 'Herramientas, metodologías y noticias de pentest.',
      'sections.bountyTitle': 'Bug bounty',
      'sections.bountyDesc': 'Actualizaciones de programas y vulnerabilidades.',
      'sections.moreTitle': 'Más',
      'sections.moreDesc': 'Recursos y categorías adicionales.',
      'sidebar.newsletterTitle': 'Boletín',
      'sidebar.newsletterText': 'Recibe resúmenes de seguridad diarios o semanales en tu correo.',
      'sidebar.daily': 'Diario',
      'sidebar.weekly': 'Semanal',
      'sidebar.newsletterDisclaimer': 'Al suscribirte aceptas nuestra política de privacidad. Puedes cancelar en cualquier momento.',
      'sidebar.digestTitle': 'Resumen de hoy',
      'sidebar.digestItem1': 'Falla crítica en VPN explotada activamente',
      'sidebar.digestItem2': 'Nueva variante de ransomware ataca al sector salud',
      'sidebar.digestItem3': 'Campaña de APT29 vinculada a nuevas brechas',
      'sidebar.digestItem4': 'CISA emite directiva de emergencia para agencias federales',
      'sidebar.digestItem5': 'Gran programa de bug bounty duplica recompensas',
      'tags.cve': 'CVE-2026-0001 (147)',
      'tags.ransomware': 'Ransomware (89)',
      'tags.apt29': 'APT29 (67)',
      'tags.zeroDay': 'Zero‑Day (52)',
      'tags.supplyChain': 'Cadena de suministro (41)',
      'tags.cisa': 'CISA (38)',
      'loading.moreNews': 'Cargando más noticias...',
      'card.read': 'Leer',
      'search.placeholder': 'Buscar noticias, IOCs, actores'
    },
    fr: {
      'nav.breaking': 'À la une',
      'nav.threatIntel': 'Renseignement sur les menaces',
      'nav.malware': 'Malware',
      'nav.apt': 'APT',
      'nav.breaches': 'Fuites de données',
      'nav.pentest': 'Pentest',
      'nav.bugBounty': 'Bug bounty',
      'nav.more': 'Plus',
      'more.deepDives': 'Analyses détaillées',
      'more.beginner': 'Débutant',
      'more.research': 'Recherche',
      'more.darkWeb': 'Dark web',
      'badge.breaking': 'ALERTE',
      'filters.vendorNeutral': 'Contenu neutre seulement',
      'filters.time.label': 'Dernières 24 h',
      'filters.time.lastHour': 'Dernière heure',
      'filters.time.last24h': 'Dernières 24 h',
      'filters.time.last7d': '7 derniers jours',
      'filters.time.last30d': '30 derniers jours',
      'filters.time.all': 'Toute la période',
      'filters.type.label': 'Type',
      'filters.type.news': 'Actualités',
      'filters.type.analysis': 'Analyse',
      'filters.type.report': 'Rapport',
      'filters.type.advisory': 'Avis',
      'filters.sources.label': 'Sources',
      'filters.sources.all': 'Toutes les sources',
      'filters.sources.news': 'Actualités',
      'filters.sources.analysis': 'Analyses',
      'filters.sources.report': 'Rapports',
      'filters.sources.advisory': 'Avis',
      'sections.latestNews': 'Dernières actualités sécurité',
      'sections.aptTitle': 'APT et menaces avancées',
      'sections.aptDesc': 'Analyses et rapports sur les groupes APT.',
      'sections.breachesTitle': 'Fuites de données',
      'sections.breachesDesc': 'Suivi des incidents et divulgations de données.',
      'sections.pentestTitle': 'Tests d’intrusion',
      'sections.pentestDesc': 'Outils, méthodologies et actualités pentest.',
      'sections.bountyTitle': 'Bug bounty',
      'sections.bountyDesc': 'Mises à jour des programmes et vulnérabilités.',
      'sections.moreTitle': 'Plus',
      'sections.moreDesc': 'Ressources et catégories supplémentaires.',
      'sidebar.newsletterTitle': 'Lettre d’information',
      'sidebar.newsletterText': 'Recevez des résumés de sécurité quotidiens ou hebdomadaires.',
      'sidebar.daily': 'Quotidien',
      'sidebar.weekly': 'Hebdomadaire',
      'sidebar.newsletterDisclaimer': 'En vous abonnant, vous acceptez notre politique de confidentialité. Désinscription à tout moment.',
      'sidebar.digestTitle': 'Résumé du jour',
      'sidebar.digestItem1': 'Faille critique VPN exploitée activement',
      'sidebar.digestItem2': 'Un nouveau rançongiciel vise le secteur de la santé',
      'sidebar.digestItem3': 'Campagne APT29 liée à de récentes intrusions',
      'sidebar.digestItem4': 'La CISA publie une directive d’urgence pour les agences fédérales',
      'sidebar.digestItem5': 'Un grand programme de bug bounty double ses primes',
      'tags.cve': 'CVE-2026-0001 (147)',
      'tags.ransomware': 'Rançongiciel (89)',
      'tags.apt29': 'APT29 (67)',
      'tags.zeroDay': 'Zero‑Day (52)',
      'tags.supplyChain': 'Chaîne d’approvisionnement (41)',
      'tags.cisa': 'CISA (38)',
      'loading.moreNews': 'Chargement de nouvelles actualités…',
      'card.read': 'Lire',
      'search.placeholder': 'Rechercher des actus, IOCs, acteurs'
    },
    de: {
      'nav.breaking': 'Aktuell',
      'nav.threatIntel': 'Bedrohungsinformationen',
      'nav.malware': 'Malware',
      'nav.apt': 'APT',
      'nav.breaches': 'Datenlecks',
      'nav.pentest': 'Pentest',
      'nav.bugBounty': 'Bug Bounty',
      'nav.more': 'Mehr',
      'more.deepDives': 'Deep Dives',
      'more.beginner': 'Einsteiger',
      'more.research': 'Recherche',
      'more.darkWeb': 'Dark Web',
      'badge.breaking': 'EILMELDUNG',
      'filters.vendorNeutral': 'Nur neutrale Inhalte',
      'filters.time.label': 'Letzte 24 Std.',
      'filters.time.lastHour': 'Letzte Stunde',
      'filters.time.last24h': 'Letzte 24 Std.',
      'filters.time.last7d': 'Letzte 7 Tage',
      'filters.time.last30d': 'Letzte 30 Tage',
      'filters.time.all': 'Gesamter Zeitraum',
      'filters.type.label': 'Typ',
      'filters.type.news': 'News',
      'filters.type.analysis': 'Analyse',
      'filters.type.report': 'Bericht',
      'filters.type.advisory': 'Hinweis',
      'filters.sources.label': 'Quellen',
      'filters.sources.all': 'Alle Quellen',
      'filters.sources.news': 'News',
      'filters.sources.analysis': 'Analysen',
      'filters.sources.report': 'Berichte',
      'filters.sources.advisory': 'Hinweise',
      'sections.latestNews': 'Aktuelle Sicherheitsmeldungen',
      'sections.aptTitle': 'APT & fortgeschrittene Bedrohungen',
      'sections.aptDesc': 'Analysen und Berichte zu APT-Gruppen.',
      'sections.breachesTitle': 'Datenlecks',
      'sections.breachesDesc': 'Überblick über Vorfälle und Offenlegungen.',
      'sections.pentestTitle': 'Penetrationstests',
      'sections.pentestDesc': 'Tools, Methoden und Pentest-News.',
      'sections.bountyTitle': 'Bug Bounty',
      'sections.bountyDesc': 'Programm-Updates und Schwachstellen.',
      'sections.moreTitle': 'Mehr',
      'sections.moreDesc': 'Weitere Ressourcen und Kategorien.',
      'sidebar.newsletterTitle': 'Newsletter',
      'sidebar.newsletterText': 'Erhalte tägliche oder wöchentliche Sicherheits-Updates per E‑Mail.',
      'sidebar.daily': 'Täglich',
      'sidebar.weekly': 'Wöchentlich',
      'sidebar.newsletterDisclaimer': 'Mit der Anmeldung akzeptierst du unsere Datenschutzerklärung. Abmeldung jederzeit möglich.',
      'sidebar.digestTitle': 'Heutige Übersicht',
      'sidebar.digestItem1': 'Kritische VPN‑Zero‑Day wird aktiv ausgenutzt',
      'sidebar.digestItem2': 'Neue Ransomware‑Variante zielt auf den Gesundheitssektor',
      'sidebar.digestItem3': 'APT29‑Kampagne mit aktuellen Datenlecks verknüpft',
      'sidebar.digestItem4': 'CISA veröffentlicht Notfallanweisung für Bundesbehörden',
      'sidebar.digestItem5': 'Großes Bug‑Bounty‑Programm verdoppelt Prämien',
      'tags.cve': 'CVE-2026-0001 (147)',
      'tags.ransomware': 'Ransomware (89)',
      'tags.apt29': 'APT29 (67)',
      'tags.zeroDay': 'Zero‑Day (52)',
      'tags.supplyChain': 'Lieferkette (41)',
      'tags.cisa': 'CISA (38)',
      'loading.moreNews': 'Weitere Meldungen werden geladen…',
      'card.read': 'Lesen',
      'search.placeholder': 'Nach News, IOCs, Akteuren suchen'
    },
    ja: {
      'nav.breaking': '速報',
      'nav.threatIntel': '脅威インテリジェンス',
      'nav.malware': 'マルウェア',
      'nav.apt': 'APT',
      'nav.breaches': '情報漏えい',
      'nav.pentest': 'ペンテスト',
      'nav.bugBounty': 'バグバウンティ',
      'nav.more': 'その他',
      'more.deepDives': '詳細レポート',
      'more.beginner': '初心者向け',
      'more.research': 'リサーチ',
      'more.darkWeb': 'ダークウェブ',
      'badge.breaking': '緊急',
      'filters.vendorNeutral': 'ベンダー中立のみ',
      'filters.time.label': '直近24時間',
      'filters.time.lastHour': '直近1時間',
      'filters.time.last24h': '直近24時間',
      'filters.time.last7d': '直近7日間',
      'filters.time.last30d': '直近30日間',
      'filters.time.all': '全期間',
      'filters.type.label': '種類',
      'filters.type.news': 'ニュース',
      'filters.type.analysis': '分析',
      'filters.type.report': 'レポート',
      'filters.type.advisory': 'アドバイザリ',
      'filters.sources.label': 'ソース',
      'filters.sources.all': 'すべてのソース',
      'filters.sources.news': 'ニュース',
      'filters.sources.analysis': '分析',
      'filters.sources.report': 'レポート',
      'filters.sources.advisory': 'アドバイザリ',
      'sections.latestNews': '最新のセキュリティニュース',
      'sections.aptTitle': 'APT・高度な脅威',
      'sections.aptDesc': 'APT グループに関する分析とレポート。',
      'sections.breachesTitle': '情報漏えい',
      'sections.breachesDesc': '主な漏えいインシデントの追跡。',
      'sections.pentestTitle': 'ペネトレーションテスト',
      'sections.pentestDesc': 'ツール・手法・ペンテスト関連ニュース。',
      'sections.bountyTitle': 'バグバウンティ',
      'sections.bountyDesc': 'プログラム更新と脆弱性情報。',
      'sections.moreTitle': 'その他',
      'sections.moreDesc': '追加のリソースとカテゴリ。',
      'sidebar.newsletterTitle': 'ニュースレター',
      'sidebar.newsletterText': 'セキュリティニュースを毎日または毎週メールで受信します。',
      'sidebar.daily': '毎日',
      'sidebar.weekly': '毎週',
      'sidebar.newsletterDisclaimer': '購読するとプライバシーポリシーに同意したことになります。いつでも解除できます。',
      'sidebar.digestTitle': '本日のダイジェスト',
      'sidebar.digestItem1': 'VPN のクリティカルなゼロデイが積極的に悪用中',
      'sidebar.digestItem2': '新しいランサムウェアが医療機関を標的に',
      'sidebar.digestItem3': 'APT29 キャンペーンが最近の侵害と関連付けられる',
      'sidebar.digestItem4': 'CISA が連邦機関向けの緊急指令を発表',
      'sidebar.digestItem5': '大手バグバウンティプログラムが報奨金を2倍に',
      'tags.cve': 'CVE-2026-0001 (147)',
      'tags.ransomware': 'ランサムウェア (89)',
      'tags.apt29': 'APT29 (67)',
      'tags.zeroDay': 'ゼロデイ (52)',
      'tags.supplyChain': 'サプライチェーン (41)',
      'tags.cisa': 'CISA (38)',
      'loading.moreNews': 'ニュースを読み込み中…',
      'card.read': '続きを読む',
      'search.placeholder': 'ニュース・IOC・アクターを検索'
    },
    zh: {
      'nav.breaking': '快讯',
      'nav.threatIntel': '威胁情报',
      'nav.malware': '恶意软件',
      'nav.apt': 'APT',
      'nav.breaches': '数据泄露',
      'nav.pentest': '渗透测试',
      'nav.bugBounty': '漏洞赏金',
      'nav.more': '更多',
      'more.deepDives': '深度分析',
      'more.beginner': '入门',
      'more.research': '研究',
      'more.darkWeb': '暗网',
      'badge.breaking': '紧急',
      'filters.vendorNeutral': '仅供应商中立内容',
      'filters.time.label': '最近24小时',
      'filters.time.lastHour': '最近1小时',
      'filters.time.last24h': '最近24小时',
      'filters.time.last7d': '最近7天',
      'filters.time.last30d': '最近30天',
      'filters.time.all': '全部时间',
      'filters.type.label': '类型',
      'filters.type.news': '新闻',
      'filters.type.analysis': '分析',
      'filters.type.report': '报告',
      'filters.type.advisory': '公告',
      'filters.sources.label': '来源',
      'filters.sources.all': '全部来源',
      'filters.sources.news': '新闻',
      'filters.sources.analysis': '分析',
      'filters.sources.report': '报告',
      'filters.sources.advisory': '公告',
      'sections.latestNews': '最新安全新闻',
      'sections.aptTitle': 'APT 与高级威胁',
      'sections.aptDesc': '关于 APT 组织的分析与报告。',
      'sections.breachesTitle': '数据泄露',
      'sections.breachesDesc': '跟踪主要数据泄露事件与披露。',
      'sections.pentestTitle': '渗透测试',
      'sections.pentestDesc': '工具、方法与渗透测试新闻。',
      'sections.bountyTitle': '漏洞赏金',
      'sections.bountyDesc': '赏金计划更新与漏洞披露。',
      'sections.moreTitle': '更多',
      'sections.moreDesc': '更多资源和分类。',
      'sidebar.newsletterTitle': '新闻简报',
      'sidebar.newsletterText': '每日或每周接收安全新闻摘要邮件。',
      'sidebar.daily': '每日',
      'sidebar.weekly': '每周',
      'sidebar.newsletterDisclaimer': '订阅即表示同意我们的隐私政策，可随时取消。',
      'sidebar.digestTitle': '今日摘要',
      'sidebar.digestItem1': 'VPN 严重零日漏洞正在被积极利用',
      'sidebar.digestItem2': '新型勒索软件瞄准医疗行业',
      'sidebar.digestItem3': 'APT29 活动与近期入侵事件相关',
      'sidebar.digestItem4': 'CISA 发布联邦机构紧急指令',
      'sidebar.digestItem5': '大型赏金计划将奖励翻倍',
      'tags.cve': 'CVE-2026-0001 (147)',
      'tags.ransomware': '勒索软件 (89)',
      'tags.apt29': 'APT29 (67)',
      'tags.zeroDay': '零日漏洞 (52)',
      'tags.supplyChain': '供应链 (41)',
      'tags.cisa': 'CISA (38)',
      'loading.moreNews': '正在加载更多新闻…',
      'card.read': '阅读',
      'search.placeholder': '搜索新闻、IOC、攻击者'
    },
    ru: {
      'nav.breaking': 'Срочно',
      'nav.threatIntel': 'Аналитика угроз',
      'nav.malware': 'Вредоносное ПО',
      'nav.apt': 'APT',
      'nav.breaches': 'Утечки данных',
      'nav.pentest': 'Пентест',
      'nav.bugBounty': 'Bug bounty',
      'nav.more': 'Ещё',
      'more.deepDives': 'Подробные обзоры',
      'more.beginner': 'Для новичков',
      'more.research': 'Исследования',
      'more.darkWeb': 'Даркнет',
      'badge.breaking': 'СРОЧНО',
      'filters.vendorNeutral': 'Только нейтральный контент',
      'filters.time.label': 'За 24 часа',
      'filters.time.lastHour': 'За час',
      'filters.time.last24h': 'За 24 часа',
      'filters.time.last7d': 'За 7 дней',
      'filters.time.last30d': 'За 30 дней',
      'filters.time.all': 'За всё время',
      'filters.type.label': 'Тип',
      'filters.type.news': 'Новости',
      'filters.type.analysis': 'Аналитика',
      'filters.type.report': 'Отчёт',
      'filters.type.advisory': 'Предупреждение',
      'filters.sources.label': 'Источники',
      'filters.sources.all': 'Все источники',
      'filters.sources.news': 'Новости',
      'filters.sources.analysis': 'Аналитика',
      'filters.sources.report': 'Отчёты',
      'filters.sources.advisory': 'Предупреждения',
      'sections.latestNews': 'Последние новости безопасности',
      'sections.aptTitle': 'APT и сложные угрозы',
      'sections.aptDesc': 'Аналитика и отчёты по APT‑группам.',
      'sections.breachesTitle': 'Утечки данных',
      'sections.breachesDesc': 'Отслеживание инцидентов и раскрытий.',
      'sections.pentestTitle': 'Тестирование на проникновение',
      'sections.pentestDesc': 'Инструменты, методики и новости пентеста.',
      'sections.bountyTitle': 'Bug bounty',
      'sections.bountyDesc': 'Обновления программ и найденные уязвимости.',
      'sections.moreTitle': 'Ещё',
      'sections.moreDesc': 'Дополнительные разделы и ресурсы.',
      'sidebar.newsletterTitle': 'Рассылка',
      'sidebar.newsletterText': 'Получайте ежедневные или еженедельные дайджесты по безопасности.',
      'sidebar.daily': 'Каждый день',
      'sidebar.weekly': 'Каждую неделю',
      'sidebar.newsletterDisclaimer': 'Подписываясь, вы принимаете политику конфиденциальности. Можно отписаться в любой момент.',
      'sidebar.digestTitle': 'Итоги дня',
      'sidebar.digestItem1': 'Критическая уязвимость VPN активно эксплуатируется',
      'sidebar.digestItem2': 'Новый вымогатель нацелен на медорганизации',
      'sidebar.digestItem3': 'Кампания APT29 связана с недавними взломами',
      'sidebar.digestItem4': 'CISA выпускает экстренную директиву для федеральных органов',
      'sidebar.digestItem5': 'Крупная bug bounty‑программа удваивает выплаты',
      'tags.cve': 'CVE-2026-0001 (147)',
      'tags.ransomware': 'Ransomware (89)',
      'tags.apt29': 'APT29 (67)',
      'tags.zeroDay': 'Zero‑Day (52)',
      'tags.supplyChain': 'Цепочка поставок (41)',
      'tags.cisa': 'CISA (38)',
      'loading.moreNews': 'Загружаем дополнительные новости…',
      'card.read': 'Читать',
      'search.placeholder': 'Поиск новостей, IOC и акторов'
    },
    ar: {
      'nav.breaking': 'عاجل',
      'nav.threatIntel': 'معلومات التهديدات',
      'nav.malware': 'برامج خبيثة',
      'nav.apt': 'APT',
      'nav.breaches': 'تسريبات بيانات',
      'nav.pentest': 'اختبار اختراق',
      'nav.bugBounty': 'مكافآت ثغرات',
      'nav.more': 'المزيد',
      'more.deepDives': 'تحليلات متعمقة',
      'more.beginner': 'مبتدئين',
      'more.research': 'بحث',
      'more.darkWeb': 'الويب المظلم',
      'badge.breaking': 'عاجل',
      'filters.vendorNeutral': 'محتوى محايد فقط',
      'filters.time.label': 'آخر 24 ساعة',
      'filters.time.lastHour': 'آخر ساعة',
      'filters.time.last24h': 'آخر 24 ساعة',
      'filters.time.last7d': 'آخر 7 أيام',
      'filters.time.last30d': 'آخر 30 يومًا',
      'filters.time.all': 'كل الوقت',
      'filters.type.label': 'النوع',
      'filters.type.news': 'أخبار',
      'filters.type.analysis': 'تحليل',
      'filters.type.report': 'تقرير',
      'filters.type.advisory': 'تحذير',
      'filters.sources.label': 'المصادر',
      'filters.sources.all': 'كل المصادر',
      'filters.sources.news': 'أخبار',
      'filters.sources.analysis': 'تحليلات',
      'filters.sources.report': 'تقارير',
      'filters.sources.advisory': 'تحذيرات',
      'sections.latestNews': 'أحدث أخبار الأمن',
      'sections.aptTitle': 'تهديدات APT المتقدمة',
      'sections.aptDesc': 'تحليلات وتقارير عن مجموعات APT.',
      'sections.breachesTitle': 'تسريبات البيانات',
      'sections.breachesDesc': 'متابعة حوادث التسريب والإفصاح.',
      'sections.pentestTitle': 'اختبارات الاختراق',
      'sections.pentestDesc': 'أدوات ومنهجيات وأخبار الاختبار.',
      'sections.bountyTitle': 'مكافآت الثغرات',
      'sections.bountyDesc': 'تحديثات البرامج والثغرات المبلغ عنها.',
      'sections.moreTitle': 'المزيد',
      'sections.moreDesc': 'موارد وأقسام إضافية.',
      'sidebar.newsletterTitle': 'النشرة البريدية',
      'sidebar.newsletterText': 'استلم ملخصات أمنية يومية أو أسبوعية على بريدك.',
      'sidebar.daily': 'يوميًا',
      'sidebar.weekly': 'أسبوعيًا',
      'sidebar.newsletterDisclaimer': 'بالاشتراك، فإنك توافق على سياسة الخصوصية. يمكنك الإلغاء في أي وقت.',
      'sidebar.digestTitle': 'ملخص اليوم',
      'sidebar.digestItem1': 'ثغرة خطيرة في VPN يتم استغلالها بنشاط',
      'sidebar.digestItem2': 'نسخة جديدة من برامج الفدية تستهدف قطاع الرعاية الصحية',
      'sidebar.digestItem3': 'حملة APT29 مرتبطة بحوادث اختراق حديثة',
      'sidebar.digestItem4': 'هيئة CISA تصدر توجيهًا طارئًا للوكالات الفيدرالية',
      'sidebar.digestItem5': 'برنامج مكافآت ثغرات كبير يضاعف قيمة الجوائز',
      'tags.cve': 'CVE-2026-0001 (147)',
      'tags.ransomware': 'برامج فدية (89)',
      'tags.apt29': 'APT29 (67)',
      'tags.zeroDay': 'ثغرة يوم الصفر (52)',
      'tags.supplyChain': 'سلسلة التوريد (41)',
      'tags.cisa': 'CISA (38)',
      'loading.moreNews': 'جاري تحميل المزيد من الأخبار…',
      'card.read': 'قراءة',
      'search.placeholder': 'ابحث في الأخبار و IOC والجهات'
    },
    az: {
      'nav.breaking': 'Təcili',
      'nav.threatIntel': 'Təhlükə kəşfiyyatı',
      'nav.malware': 'Zərərli proqramlar',
      'nav.apt': 'APT',
      'nav.breaches': 'Məlumat sızmaları',
      'nav.pentest': 'Pentest',
      'nav.bugBounty': 'Bug bounty',
      'nav.more': 'Daha çox',
      'more.deepDives': 'Dərin analitika',
      'more.beginner': 'Yeni başlayanlar',
      'more.research': 'Tədqiqat',
      'more.darkWeb': 'Dark web',
      'badge.breaking': 'TƏCİLİ',
      'filters.vendorNeutral': 'Yalnız neytral məzmun',
      'filters.time.label': 'Son 24 saat',
      'filters.time.lastHour': 'Son 1 saat',
      'filters.time.last24h': 'Son 24 saat',
      'filters.time.last7d': 'Son 7 gün',
      'filters.time.last30d': 'Son 30 gün',
      'filters.time.all': 'Bütün müddət',
      'filters.type.label': 'Növ',
      'filters.type.news': 'Xəbərlər',
      'filters.type.analysis': 'Analiz',
      'filters.type.report': 'Hesabat',
      'filters.type.advisory': 'Xəbərdarlıq',
      'filters.sources.label': 'Mənbələr',
      'filters.sources.all': 'Bütün mənbələr',
      'filters.sources.news': 'Xəbərlər',
      'filters.sources.analysis': 'Analizlər',
      'filters.sources.report': 'Hesabatlar',
      'filters.sources.advisory': 'Xəbərdarlıqlar',
      'sections.latestNews': 'Son təhlükəsizlik xəbərləri',
      'sections.aptTitle': 'APT və qabaqcıl təhdidlər',
      'sections.aptDesc': 'APT qrupları barədə analiz və hesabatlar.',
      'sections.breachesTitle': 'Məlumat sızmaları',
      'sections.breachesDesc': 'Əsas sızma insidentlərinin izlənməsi.',
      'sections.pentestTitle': 'Penetrasiya testləri',
      'sections.pentestDesc': 'Alətlər, metodologiyalar və pentest xəbərləri.',
      'sections.bountyTitle': 'Bug bounty',
      'sections.bountyDesc': 'Proqram yenilikləri və açıqlanan zəifliklər.',
      'sections.moreTitle': 'Daha çox',
      'sections.moreDesc': 'Əlavə resurslar və kateqoriyalar.',
      'sidebar.newsletterTitle': 'Bülleten',
      'sidebar.newsletterText': 'Gündəlik və ya həftəlik təhlükəsizlik xülasələrini poçtunuza alın.',
      'sidebar.daily': 'Gündəlik',
      'sidebar.weekly': 'Həftəlik',
      'sidebar.newsletterDisclaimer': 'Abunə olmaqla məxfilik siyasətimizi qəbul edirsiniz. İstənilən vaxt ləğv edə bilərsiniz.',
      'sidebar.digestTitle': 'Bugünkü xülasə',
      'sidebar.digestItem1': 'VPN üçün kritik zero‑day fəal şəkildə istismar olunur',
      'sidebar.digestItem2': 'Yeni ransomware varianti səhiyyə sektorunu hədəf alır',
      'sidebar.digestItem3': 'APT29 kampaniyası son sızmalarla əlaqələndirilir',
      'sidebar.digestItem4': 'CISA federal qurumlar üçün təcili direktiv dərc edib',
      'sidebar.digestItem5': 'Böyük bug bounty proqramı mükafatları ikiqat artırır',
      'tags.cve': 'CVE-2026-0001 (147)',
      'tags.ransomware': 'Ransomware (89)',
      'tags.apt29': 'APT29 (67)',
      'tags.zeroDay': 'Zero‑Day (52)',
      'tags.supplyChain': 'Təchizat zənciri (41)',
      'tags.cisa': 'CISA (38)',
      'loading.moreNews': 'Daha çox xəbər yüklənir…',
      'card.read': 'Oxu',
      'search.placeholder': 'Xəbər, IOC və aktor axtar'
    }
  };

  function applyLanguage(lang) {
    const dict = translations[lang] || translations.en;
    // update document language + direction (RTL for Arabic)
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.querySelectorAll('[data-i18n-key]').forEach(function (el) {
      const key = el.getAttribute('data-i18n-key');
      const value = dict[key];
      if (value) {
        el.textContent = value;
      }
    });
    const searchInput = document.querySelector('.search-box input');
    const baseDict = translations.en;
    if (searchInput) {
      searchInput.placeholder = dict['search.placeholder'] || baseDict['search.placeholder'];
    }
    window.currentLanguage = lang;
    if (typeof window.applyFilters === 'function') {
      window.applyFilters();
    }
  }

  // initial language
  applyLanguage('en');

  function closeLangDropdown() {
    langTrigger.setAttribute('aria-expanded', 'false');
    langDropdown.classList.remove('open');
    // Reset positioning
    langDropdown.style.position = '';
    langDropdown.style.top = '';
    langDropdown.style.left = '';
    langDropdown.style.width = '';
    langDropdown.style.right = '';
  }

  function openLangDropdown() {
    langTrigger.setAttribute('aria-expanded', 'true');
    // Calculate position for fixed positioning to escape stacking contexts
    const triggerRect = langTrigger.getBoundingClientRect();
    const wrapperRect = langTrigger.closest('.lang-select-wrapper').getBoundingClientRect();
    langDropdown.style.position = 'fixed';
    langDropdown.style.top = (triggerRect.bottom + 6) + 'px';
    langDropdown.style.left = wrapperRect.left + 'px';
    langDropdown.style.width = wrapperRect.width + 'px';
    langDropdown.style.right = 'auto';
    langDropdown.classList.add('open');
  }

  langTrigger.addEventListener('click', function (e) {
    e.stopPropagation();
    const isOpen = langDropdown.classList.contains('open');
    if (isOpen) {
      langDropdown.classList.add('lang-dropdown-closing');
      setTimeout(function () {
        closeLangDropdown();
        langDropdown.classList.remove('lang-dropdown-closing');
      }, 200);
    } else {
      openLangDropdown();
    }
  });

  langOptions.forEach(function (opt) {
    opt.addEventListener('click', function (e) {
      e.stopPropagation();
      // Ripple effect
      const ripple = document.createElement('span');
      ripple.className = 'lang-ripple';
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      this.appendChild(ripple);
      setTimeout(function () { ripple.remove(); }, 600);

      langOptions.forEach(function (o) { o.classList.remove('selected'); });
      this.classList.add('selected');
      langCurrent.textContent = this.getAttribute('data-short') || this.textContent;
      const chosenLang = this.getAttribute('data-lang');
      if (langSelectNative) {
        langSelectNative.value = chosenLang;
      }
      applyLanguage(chosenLang || 'en');
      langCurrent.style.transform = 'scale(1.15)';
      setTimeout(function () {
        langCurrent.style.transform = 'scale(1)';
      }, 200);
      closeLangDropdown();
    });

    opt.addEventListener('mouseenter', function () {
      this.style.transform = 'translateX(4px)';
    });
    opt.addEventListener('mouseleave', function () {
      this.style.transform = 'translateX(0)';
    });
  });

  // Update dropdown position on scroll/resize when open
  function updateDropdownPosition() {
    if (langDropdown.classList.contains('open')) {
      const triggerRect = langTrigger.getBoundingClientRect();
      const wrapperRect = langTrigger.closest('.lang-select-wrapper').getBoundingClientRect();
      langDropdown.style.top = (triggerRect.bottom + 6) + 'px';
      langDropdown.style.left = wrapperRect.left + 'px';
      langDropdown.style.width = wrapperRect.width + 'px';
    }
  }

  window.addEventListener('scroll', updateDropdownPosition, true);
  window.addEventListener('resize', updateDropdownPosition);

  document.addEventListener('click', function () {
    if (langDropdown.classList.contains('open')) closeLangDropdown();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && langDropdown.classList.contains('open')) {
      closeLangDropdown();
      langTrigger.focus();
    }
  });

  langDropdown.addEventListener('click', function (e) {
    e.stopPropagation();
  });

  // ----- RSS dropdown (fixed positioning so it stays on top of page content) -----
  (function () {
    const rssTrigger = document.getElementById('rssTrigger');
    const rssDropdown = document.getElementById('rssDropdown');
    if (!rssTrigger || !rssDropdown) return;

    function positionRssDropdown() {
      if (!rssDropdown.classList.contains('open')) return;
      const rect = rssTrigger.getBoundingClientRect();
      rssDropdown.style.position = 'fixed';
      rssDropdown.style.top = (rect.bottom + 4) + 'px';
      rssDropdown.style.right = (window.innerWidth - rect.right) + 'px';
      rssDropdown.style.left = 'auto';
      rssDropdown.style.width = 'auto';
      rssDropdown.style.minWidth = '140px';
    }

    function closeRss() {
      rssDropdown.classList.remove('open');
      rssTrigger.setAttribute('aria-expanded', 'false');
      rssDropdown.style.position = '';
      rssDropdown.style.top = '';
      rssDropdown.style.right = '';
      rssDropdown.style.left = '';
      rssDropdown.style.width = '';
      rssDropdown.style.minWidth = '';
    }

    rssTrigger.addEventListener('click', function (e) {
      e.stopPropagation();
      const isOpen = rssDropdown.classList.contains('open');
      if (isOpen) {
        closeRss();
      } else {
        rssDropdown.classList.add('open');
        rssTrigger.setAttribute('aria-expanded', 'true');
        positionRssDropdown();
      }
    });
    document.addEventListener('click', function () {
      if (rssDropdown.classList.contains('open')) closeRss();
    });
    rssDropdown.addEventListener('click', function (e) { e.stopPropagation(); });
    window.addEventListener('scroll', positionRssDropdown, true);
    window.addEventListener('resize', positionRssDropdown);
  })();

  // ----- Theme toggle (dark/light) with cool animation -----
  (function () {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;
    const icon = themeToggle.querySelector('.theme-icon');
    const stored = localStorage.getItem('theme');
    if (stored === 'light') {
      document.documentElement.classList.add('theme-light');
      if (icon) { icon.classList.remove('fa-sun'); icon.classList.add('fa-moon'); }
    }
    themeToggle.addEventListener('click', function () {
      if (!icon) return;
      icon.classList.add('theme-icon-animate');
      var animDuration = 600;
      var half = animDuration / 2;
      setTimeout(function () {
        const isLight = document.documentElement.classList.toggle('theme-light');
        icon.classList.toggle('fa-sun', !isLight);
        icon.classList.toggle('fa-moon', isLight);
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
      }, half);
      icon.addEventListener('animationend', function removeAnim() {
        icon.removeEventListener('animationend', removeAnim);
        icon.classList.remove('theme-icon-animate');
      }, { once: true });
    });
  })();

  // ----- Search help tooltip (body-level so it never goes behind navbar) -----
  (function () {
    var wrap = document.getElementById('searchHelpWrap');
    var popup = document.getElementById('search-help-tooltip-popup');
    if (!wrap || !popup) return;

    function showTooltip() {
      var rect = wrap.getBoundingClientRect();
      var w = popup.offsetWidth || 240;
      var shiftLeft = 60; /* push tooltip left so it’s fully visible */
      popup.style.left = (rect.left + rect.width / 2 - w / 2 - shiftLeft) + 'px';
      popup.style.top = (rect.bottom + 8) + 'px';
      popup.classList.add('is-visible');
    }

    function hideTooltip() {
      popup.classList.remove('is-visible');
    }

    wrap.addEventListener('mouseenter', showTooltip);
    wrap.addEventListener('mouseleave', hideTooltip);
  })();

  // ----- Multi-selection state for Type dropdown -----
  window.selectedTypes = [];

  // ----- Filter dropdowns: Type, Last 24h, Sources -----
  function setupFilterDropdown(triggerId, dropdownId, optionClass, labelSelector, useGreenSelected, allowMultiSelect) {
    const trigger = document.getElementById(triggerId);
    const dropdown = document.getElementById(dropdownId);
    if (!trigger || !dropdown) return;
    const labelEl = trigger.querySelector(labelSelector || '.filter-btn-label');
    const options = dropdown.querySelectorAll('.filter-dropdown-option');

    function close() {
      trigger.setAttribute('aria-expanded', 'false');
      dropdown.classList.remove('open');
    }
    function open() {
      document.querySelectorAll('.filter-dropdown.open').forEach(function (d) { d.classList.remove('open'); });
      document.querySelectorAll('.filter-btn[aria-expanded="true"]').forEach(function (t) { t.setAttribute('aria-expanded', 'false'); });
      trigger.setAttribute('aria-expanded', 'true');
      dropdown.classList.add('open');
    }

    trigger.addEventListener('click', function (e) {
      e.stopPropagation();
      if (dropdown.classList.contains('open')) close();
      else open();
    });

    options.forEach(function (opt) {
      opt.addEventListener('click', function (e) {
        e.stopPropagation();
        
        if (allowMultiSelect) {
          // Multi-select mode (for Type dropdown)
          const value = this.getAttribute('data-value');
          const isSelected = this.classList.contains('selected');
          
          if (isSelected) {
            this.classList.remove('selected');
            const index = window.selectedTypes.indexOf(value);
            if (index > -1) {
              window.selectedTypes.splice(index, 1);
            }
          } else {
            this.classList.add('selected');
            if (window.selectedTypes.indexOf(value) === -1) {
              window.selectedTypes.push(value);
            }
          }
          
          // Update button label
          if (labelEl) {
            if (window.selectedTypes.length === 0) {
              labelEl.textContent = 'News';
            } else if (window.selectedTypes.length === 1) {
              const selectedOption = dropdown.querySelector('.filter-dropdown-option.selected');
              labelEl.textContent = selectedOption ? selectedOption.textContent.trim() : 'News';
            } else {
              labelEl.textContent = window.selectedTypes.length + ' selected';
            }
          }
          
          updateFilterCount();
          // Don't close dropdown for multi-select - keep it open
        } else {
          // Single-select mode (for Time and Sources dropdowns)
          options.forEach(function (o) { o.classList.remove('selected'); });
          this.classList.add('selected');
          if (labelEl) labelEl.textContent = this.textContent.trim();
          close();
        }
        
        if (typeof window.applyFilters === 'function') window.applyFilters();
      });
    });

    document.addEventListener('click', function () {
      if (dropdown.classList.contains('open')) close();
    });
    dropdown.addEventListener('click', function (e) { e.stopPropagation(); });
  }

  setupFilterDropdown('timeTrigger', 'timeDropdown', null, '.filter-btn-label', true, false);
  setupFilterDropdown('typeTrigger', 'typeDropdown', null, '.filter-btn-label', false, true); // Enable multi-select
  setupFilterDropdown('sourcesTrigger', 'sourcesDropdown', null, '.filter-btn-label', false, false);

  // ----- Filter Clear Button and Count -----
  const filterClearBtn = document.getElementById('filterClearBtn');
  const filterCount = document.getElementById('filterCount');
  
  function updateFilterCount() {
    const count = window.selectedTypes.length;
    if (filterCount) {
      filterCount.textContent = count;
      if (count > 0) {
        filterCount.classList.add('show');
      } else {
        filterCount.classList.remove('show');
      }
    }
    if (filterClearBtn) {
      if (count > 0) {
        filterClearBtn.classList.add('show');
        filterClearBtn.disabled = false;
      } else {
        filterClearBtn.classList.remove('show');
        filterClearBtn.disabled = true;
      }
    }
  }
  
  function clearAllFilters() {
    // Clear all Type selections
    window.selectedTypes = [];
    const typeOptions = document.querySelectorAll('#typeDropdown .filter-dropdown-option');
    typeOptions.forEach(function(opt) {
      opt.classList.remove('selected');
    });
    
    // Reset Type button label
    const typeLabel = document.querySelector('#typeTrigger .filter-btn-label');
    if (typeLabel) {
      typeLabel.textContent = 'News';
    }
    
    // Reset to default selection (News) - but don't add to selectedTypes to keep count at 0
    const defaultOption = document.querySelector('#typeDropdown .filter-dropdown-option[data-value="news"]');
    if (defaultOption) {
      defaultOption.classList.add('selected');
    }
    
    // Close the dropdown if open
    const typeDropdown = document.getElementById('typeDropdown');
    const typeTrigger = document.getElementById('typeTrigger');
    if (typeDropdown && typeDropdown.classList.contains('open')) {
      typeDropdown.classList.remove('open');
      if (typeTrigger) typeTrigger.setAttribute('aria-expanded', 'false');
    }
    
    updateFilterCount();
    if (typeof window.applyFilters === 'function') window.applyFilters();
  }
  
  if (filterClearBtn) {
    filterClearBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      clearAllFilters();
    });
  }
  
  // Don't add default "News" to selectedTypes - only track manual selections
  // This way the X button only appears when user makes manual selections
  
  // Initialize filter count and hide clear button initially
  updateFilterCount();

  // ----- More dropdown card -----
  const moreTrigger = document.getElementById('moreTrigger');
  const moreDropdown = document.getElementById('moreDropdown');
  
  if (moreTrigger && moreDropdown) {
    const moreOptions = moreDropdown.querySelectorAll('.more-card-option');
    let isMoreOpen = false;
    
    function updateMoreDropdownPosition() {
      if (isMoreOpen || moreDropdown.classList.contains('open')) {
        const triggerRect = moreTrigger.getBoundingClientRect();
        const wrapperRect = moreTrigger.closest('.nav-more-wrap').getBoundingClientRect();
        moreDropdown.style.position = 'fixed';
        moreDropdown.style.top = (triggerRect.bottom + 6) + 'px';
        moreDropdown.style.left = wrapperRect.left + 'px';
        moreDropdown.style.width = wrapperRect.width + 'px';
        moreDropdown.style.right = 'auto';
      }
    }
    
    function closeMore() {
      isMoreOpen = false;
      moreTrigger.setAttribute('aria-expanded', 'false');
      moreDropdown.classList.remove('open');
      // Reset positioning
      moreDropdown.style.position = '';
      moreDropdown.style.top = '';
      moreDropdown.style.left = '';
      moreDropdown.style.width = '';
      moreDropdown.style.right = '';
    }
    
    function openMore() {
      // Close other dropdowns first
      document.querySelectorAll('.filter-dropdown.open').forEach(function (d) { d.classList.remove('open'); });
      document.querySelectorAll('.filter-btn[aria-expanded="true"]').forEach(function (t) { t.setAttribute('aria-expanded', 'false'); });
      isMoreOpen = true;
      moreTrigger.setAttribute('aria-expanded', 'true');
      moreDropdown.classList.add('open');
      updateMoreDropdownPosition();
    }
    
    // Click handler for More button
    moreTrigger.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      
      if (isMoreOpen || moreDropdown.classList.contains('open')) {
        closeMore();
      } else {
        openMore();
      }
    }, true); // Use capture phase
    
    // Click handlers for dropdown options
    moreOptions.forEach(function (opt) {
      opt.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        moreOptions.forEach(function (o) { o.classList.remove('active'); });
        this.classList.add('active');
        window.currentMoreCategory = this.getAttribute('data-category');
        closeMore();
        if (typeof window.applyFilters === 'function') window.applyFilters();
      });
    });
    
    // Update dropdown position on scroll/resize when open
    function updateMorePositionOnScroll() {
      if (isMoreOpen || moreDropdown.classList.contains('open')) {
        updateMoreDropdownPosition();
      }
    }
    
    window.addEventListener('scroll', updateMorePositionOnScroll, true);
    window.addEventListener('resize', updateMorePositionOnScroll);
    
    // Close when clicking outside
    document.addEventListener('click', function (e) {
      if (isMoreOpen || moreDropdown.classList.contains('open')) {
        // Check if click is outside the dropdown and trigger
        if (!moreDropdown.contains(e.target) && !moreTrigger.contains(e.target)) {
          closeMore();
        }
      }
    }, true);
    
    // Prevent dropdown from closing when clicking inside it
    moreDropdown.addEventListener('click', function (e) { 
      e.stopPropagation(); 
    });
    
    // Also handle mousedown for better compatibility
    moreTrigger.addEventListener('mousedown', function (e) {
      e.stopPropagation();
    });
  }

  // ----- News data pool for infinite scroll -----
  const newsTemplates = [
    { id: 'card1', tags: ['CISA', 'Critical'], title: 'CISA Adds Critical VPN Flaw to Known Exploited Catalog', desc: 'Federal agencies must patch within two weeks as attacks escalate.', keywords: ['CVE-2026-0001', 'VPN', 'RCE', 'Zero-Day'], time: '15m', severity: 'high', type: 'advisory', category: 'research' },
    { id: 'card2', tags: ['Mandiant', 'Report'], title: 'APT41 Expands Supply Chain Attacks in 2026', desc: 'New report details evolving TTPs and infrastructure used by the group.', keywords: ['APT41', 'Supply Chain', 'Mandiant'], time: '3h 12m', severity: null, type: 'report', category: 'deep-dives' },
    { id: 'card3', tags: ['Ransomware'], title: 'New Ransomware Variant Targets Healthcare Sector', desc: 'Hospitals and clinics report encrypted systems and ransom demands.', keywords: ['Ransomware', 'Healthcare', 'Encryption'], time: '4h 25m', severity: 'high', type: 'news', category: 'research' },
    { id: 'card4', tags: ['CISA'], title: 'Emergency Directive: Patch VPN Zero-Day by Friday', desc: 'CISA orders federal agencies to apply vendor patches immediately.', keywords: ['CISA', 'Directive', 'VPN'], time: '5h', severity: null, type: 'advisory', category: 'research' },
    { id: 'card5', tags: ['Bug Bounty', 'Report'], title: 'Major Bug Bounty Program Doubles Critical Payouts', desc: 'Platform announces increased rewards for critical vulnerabilities.', keywords: ['Bug Bounty', 'Payouts', 'Critical'], time: '6h 30m', severity: null, type: 'news', category: 'beginner' },
    { id: 'card6', tags: ['APT29', 'Breaches'], title: 'APT29 Campaign Linked to Recent Government Breaches', desc: 'Intelligence agencies attribute multiple incidents to same actor.', keywords: ['APT29', 'Breach', 'Government'], time: '8h', severity: 'high', type: 'analysis', category: 'deep-dives' },
    { id: 'card7', tags: ['Malware', 'Critical'], title: 'Stealer Malware Spreads via Fake Software Updates', desc: 'Users tricked into installing trojanized installers from spoofed sites.', keywords: ['Malware', 'Stealer', 'Fake Updates'], time: '10h', severity: null, type: 'news', category: 'beginner' },
    { id: 'card8', tags: ['Pentest', 'Report'], title: 'Penetration Testing Framework Updated for Cloud', desc: 'New modules added for AWS, Azure, and GCP assessments.', keywords: ['Pentest', 'Cloud', 'AWS'], time: '12h', severity: null, type: 'report', category: 'deep-dives' },
    { id: 'card9', tags: ['Zero-Day', 'Critical'], title: 'Second Zero-Day in Same VPN Product Under Attack', desc: 'Researchers confirm exploitation of additional vulnerability.', keywords: ['Zero-Day', 'VPN', 'CVE'], time: '14h', severity: 'high', type: 'news', category: 'research' },
    { id: 'card10', tags: ['Threat Intel'], title: 'IOC Database Updated with Latest Campaign Signatures', desc: 'New indicators of compromise available for detection rules.', keywords: ['IOC', 'Threat Intel', 'Signatures'], time: '16h', severity: null, type: 'advisory', category: 'research' },
    { id: 'card11', tags: ['CISA', 'Report'], title: 'CISA Releases Advisory on RDP Hardening', desc: 'Best practices to reduce risk of RDP-based attacks.', keywords: ['CISA', 'RDP', 'Hardening'], time: '18h', severity: null, type: 'advisory', category: 'beginner' },
    { id: 'card12', tags: ['Breaches'], title: 'Retail Giant Discloses Third-Party Data Exposure', desc: 'Supplier breach may have exposed customer records.', keywords: ['Breach', 'Retail', 'Third-Party'], time: '20h', severity: 'high', type: 'news', category: 'dark-web' },
  ];

  let newsIndex = 0;
  var loadedNewsList = [];

  function getNextNewsItem() {
    const item = newsTemplates[newsIndex % newsTemplates.length];
    newsIndex++;
    return Object.assign({}, item);
  }

  function getSelectedFilterValue(dropdownId) {
    const dropdown = document.getElementById(dropdownId);
    if (!dropdown) return null;
    const sel = dropdown.querySelector('.filter-dropdown-option.selected');
    return sel ? sel.getAttribute('data-value') : null;
  }

  window.applyFilters = function () {
    var typeVals = window.selectedTypes && window.selectedTypes.length > 0 ? window.selectedTypes : null;
    var sourcesVal = getSelectedFilterValue('sourcesDropdown');
    var category = window.currentMoreCategory || null;
    var filtered = loadedNewsList.filter(function (item) {
      // Multi-select type filter
      if (typeVals && typeVals.length > 0) {
        if (typeVals.indexOf(item.type) === -1) return false;
      } else {
        // If no manual selections, default to "news" type
        if (item.type !== 'news') return false;
      }
      // Single-select sources filter
      if (sourcesVal && sourcesVal !== 'all' && item.type !== sourcesVal) return false;
      // Category filter
      if (category && item.category !== category) return false;
      return true;
    });
    newsGrid.innerHTML = '';
    filtered.forEach(function (data, i) {
      newsGrid.appendChild(buildCard(data, i));
    });
    loadIndicator.classList.toggle('hidden', filtered.length === 0);
  };

  function buildCard(data, index) {
    const lang = window.currentLanguage || document.documentElement.lang || 'en';
    const dict = translations[lang] || translations.en;
    const baseDict = translations.en;
    let title = data.title;
    let desc = data.desc;
    if (data.id) {
      const baseKey = 'news.' + data.id + '.';
      const tKey = baseKey + 'title';
      const dKey = baseKey + 'desc';
      title = (dict[tKey] || baseDict[tKey] || title);
      desc = (dict[dKey] || baseDict[dKey] || desc);
    }
    const readLabel = dict['card.read'] || baseDict['card.read'] || 'Read';

    const card = document.createElement('article');
    card.className = 'news-card';
    card.style.animationDelay = (index % 12) * 0.03 + 's';
    let tagSpans = data.tags.map(function (t) {
      const c = t.toLowerCase().replace(/\s/g, '');
      return '<span class="card-tag ' + c + '">' + t + '</span>';
    }).join('');
    if (data.severity) {
      tagSpans += '<span class="card-tag high"><i class="fas fa-exclamation-triangle"></i> High</span>';
    }
    const keywordSpans = data.keywords.map(function (k, i) {
      const cl = i === 0 ? 'card-keyword highlight' : 'card-keyword';
      return '<span class="' + cl + '">' + k + '</span>';
    }).join('');
    card.innerHTML =
      '<div class="card-tags">' + tagSpans + '</div>' +
      '<h3 class="card-title">' + title + '</h3>' +
      '<p class="card-desc">' + desc + '</p>' +
      '<div class="card-keywords">' + keywordSpans + '</div>' +
      '<div class="card-meta">' +
        '<span><i class="far fa-clock"></i> ' + data.time + '</span>' +
        '<button class="card-read" data-news-id="' + (data.id || '') + '">' + readLabel + '</button>' +
      '</div>';
    return card;
  }

  const newsGrid = document.getElementById('newsGrid');
  const loadIndicator = document.getElementById('loadIndicator');

  function appendNews(count) {
    for (var i = 0; i < count; i++) {
      loadedNewsList.push(getNextNewsItem());
    }
    if (typeof window.applyFilters === 'function') window.applyFilters();
    else {
      loadedNewsList.forEach(function (data, i) {
        newsGrid.appendChild(buildCard(data, i));
      });
    }
  }

  // Initial load
  appendNews(6);

  // ----- Infinite scroll -----
  let loading = false;
  const loadMoreThreshold = 400;

  function maybeLoadMore() {
    if (loading) return;
    const rect = loadIndicator.getBoundingClientRect();
    if (rect.top < window.innerHeight + loadMoreThreshold) {
      loading = true;
      loadIndicator.classList.remove('hidden');
      setTimeout(function () {
        appendNews(3);
        loadIndicator.classList.add('hidden');
        loading = false;
      }, 800);
    }
  }

  // Close filter dropdowns when Escape pressed
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('.filter-dropdown.open').forEach(function (d) { d.classList.remove('open'); });
      document.querySelectorAll('.filter-btn[aria-expanded="true"]').forEach(function (t) { t.setAttribute('aria-expanded', 'false'); });
      if (moreDropdown && moreDropdown.classList.contains('open')) {
        moreDropdown.classList.remove('open');
        if (moreTrigger) moreTrigger.setAttribute('aria-expanded', 'false');
      }
    }
  });

  window.addEventListener('scroll', function () {
    maybeLoadMore();
  }, { passive: true });

  maybeLoadMore();

  // ----- News modal (Read button overlay) -----
  const newsModal = document.getElementById('newsModal');
  const newsModalContent = newsModal ? newsModal.querySelector('.news-modal__content') : null;
  let modalOpen = false;

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function makeDetailsText(item) {
    // If you later add `details` to templates, this will automatically use it.
    if (item && item.details) return String(item.details);
    const title = item && item.title ? item.title : 'Untitled';
    const desc = item && item.desc ? item.desc : '';
    const keywords = (item && item.keywords) ? item.keywords.join(', ') : '';
    return (
      desc + '\n\n' +
      'What happened:\n' +
      '- Initial reports indicate active exploitation and ongoing incident response.\n' +
      '- Analysts recommend prioritizing patching and monitoring for related IOCs.\n\n' +
      'Why it matters:\n' +
      '- This affects common enterprise environments and could lead to lateral movement.\n\n' +
      'Recommended actions:\n' +
      '- Patch/mitigate immediately.\n' +
      '- Review logs and EDR alerts.\n' +
      '- Add detections for related indicators.\n\n' +
      'Keywords: ' + keywords + '\n' +
      'Title: ' + title
    ).trim();
  }

  function openNewsModal(item) {
    if (!newsModal || !newsModalContent || !item) return;
    modalOpen = true;
    newsModal.setAttribute('aria-hidden', 'false');
    newsModal.classList.add('open');
    document.body.classList.add('no-scroll');

    const tags = (item.tags || []).map(function (t) {
      return '<span class="news-modal__chip">' + escapeHtml(t) + '</span>';
    }).join('');

    const keywords = (item.keywords || []).map(function (k) {
      return '<span class="news-modal__chip">' + escapeHtml(k) + '</span>';
    }).join('');

    const details = escapeHtml(makeDetailsText(item)).replace(/\n/g, '<br>');

    newsModalContent.innerHTML =
      '<div class="news-modal__meta">' +
        '<span><i class="far fa-clock"></i> ' + escapeHtml(item.time || '') + '</span>' +
        '<span><i class="fas fa-tag"></i> ' + escapeHtml(item.type || '') + '</span>' +
        (item.category ? '<span><i class="fas fa-layer-group"></i> ' + escapeHtml(item.category) + '</span>' : '') +
      '</div>' +
      '<h2 class="news-modal__title" id="newsModalTitle">' + escapeHtml(item.title || '') + '</h2>' +
      (item.desc ? '<p class="card-desc">' + escapeHtml(item.desc) + '</p>' : '') +
      (tags ? '<div class="news-modal__section-title">Tags</div><div class="news-modal__chips">' + tags + '</div>' : '') +
      (keywords ? '<div class="news-modal__section-title">Keywords</div><div class="news-modal__chips">' + keywords + '</div>' : '') +
      '<div class="news-modal__section-title">Full details</div>' +
      '<div class="news-modal__body">' + details + '</div>';

    const closeBtn = newsModal.querySelector('.news-modal__close');
    if (closeBtn) closeBtn.focus();
  }

  function closeNewsModal() {
    if (!newsModal) return;
    modalOpen = false;
    newsModal.setAttribute('aria-hidden', 'true');
    newsModal.classList.remove('open');
    document.body.classList.remove('no-scroll');
    if (newsModalContent) newsModalContent.innerHTML = '';
  }

  // Event delegation: works for dynamically injected cards
  if (newsGrid) {
    newsGrid.addEventListener('click', function (e) {
      const btn = e.target && e.target.closest ? e.target.closest('.card-read') : null;
      if (!btn) return;
      e.preventDefault();
      const id = btn.getAttribute('data-news-id') || '';
      const item = loadedNewsList.find(function (x) { return (x.id || '') === id; });
      if (item) openNewsModal(item);
    });
  }

  if (newsModal) {
    newsModal.addEventListener('click', function (e) {
      // click backdrop or X to close
      const closeTarget = e.target && e.target.closest ? e.target.closest('[data-modal-close="true"]') : null;
      if (closeTarget) closeNewsModal();
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modalOpen) closeNewsModal();
  });

  // ----- Newsletter Close Button -----
  const sidebarClose = document.querySelector('.sidebar-close');
  const newsletterCard = document.querySelector('.newsletter-card');
  
  if (sidebarClose && newsletterCard) {
    sidebarClose.addEventListener('click', function() {
      newsletterCard.classList.add('hidden');
    });
  }

  // ----- Newsletter Frequency Buttons (Daily/Weekly) -----
  const freqButtons = document.querySelectorAll('.freq-btn');
  const newsletterInput = document.querySelector('.newsletter-input');
  
  freqButtons.forEach(function(btn) {
    btn.addEventListener('click', function() {
      // Remove active class from all buttons
      freqButtons.forEach(function(b) {
        b.classList.remove('active');
      });
      // Add active class to clicked button
      this.classList.add('active');
      
      // Get the selected frequency
      const frequency = this.textContent.trim().toLowerCase();
      console.log('Newsletter frequency selected:', frequency);
      
      // You can add additional logic here, such as:
      // - Storing the preference
      // - Updating a form submission
      // - Showing a confirmation message
    });
  });

  // Optional: Handle newsletter subscription (when email is entered and button is clicked)
  // You can add a submit button or handle Enter key on the email input
  if (newsletterInput) {
    newsletterInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        const email = this.value.trim();
        const activeFreqBtn = document.querySelector('.freq-btn.active');
        const frequency = activeFreqBtn ? activeFreqBtn.textContent.trim().toLowerCase() : 'daily';
        
        if (email && email.includes('@')) {
          console.log('Subscribing:', email, 'Frequency:', frequency);
          // Here you would typically send this to your backend
          alert('Thank you for subscribing! You will receive ' + frequency + ' security digests at ' + email);
          this.value = '';
        } else {
          alert('Please enter a valid email address');
        }
      }
    });
  }

  // ----- Breaking News Pagination (ticker headline, time left of arrows) -----
  const breakingPrev = document.querySelector('.breaking-prev');
  const breakingNext = document.querySelector('.breaking-next');
  const breakingHeadlineTexts = document.querySelectorAll('.breaking-headline-text');
  const breakingTime = document.querySelector('.breaking-time');
  const breakingCounter = document.querySelector('.breaking-counter');
  const breakingHeadlineInner = document.querySelector('.breaking-headline-inner');
  
  const breakingNews = [
    {
      headline: 'Critical Zero-Day in Popular VPN Software Being Actively Exploited',
      time: '19 minutes ago'
    },
    {
      headline: 'Major Healthcare Provider Hit by Ransomware Attack',
      time: '2 hours ago'
    },
    {
      headline: 'CISA Issues Emergency Directive for Federal Agencies',
      time: '4 hours ago'
    }
  ];
  
  let currentBreakingIndex = 0;
  const totalBreakingNews = breakingNews.length;
  
  function updateBreakingNews() {
    if (!breakingHeadlineTexts.length || !breakingCounter) return;
    
    const currentNews = breakingNews[currentBreakingIndex];
    const headline = currentNews.headline;
    breakingHeadlineTexts.forEach(el => { el.textContent = headline; });
    if (breakingTime) breakingTime.textContent = currentNews.time;
    breakingCounter.textContent = (currentBreakingIndex + 1) + '/' + totalBreakingNews;
    if (breakingHeadlineInner) {
      breakingHeadlineInner.style.animation = 'none';
      breakingHeadlineInner.offsetHeight;
      breakingHeadlineInner.style.animation = '';
    }
    if (breakingPrev) {
      breakingPrev.style.opacity = currentBreakingIndex === 0 ? '0.5' : '1';
      breakingPrev.style.cursor = currentBreakingIndex === 0 ? 'not-allowed' : 'pointer';
      breakingPrev.style.pointerEvents = currentBreakingIndex === 0 ? 'none' : 'auto';
    }
    if (breakingNext) {
      breakingNext.style.opacity = currentBreakingIndex === totalBreakingNews - 1 ? '0.5' : '1';
      breakingNext.style.cursor = currentBreakingIndex === totalBreakingNews - 1 ? 'not-allowed' : 'pointer';
      breakingNext.style.pointerEvents = currentBreakingIndex === totalBreakingNews - 1 ? 'none' : 'auto';
    }
  }
  
  if (breakingPrev) {
    breakingPrev.addEventListener('click', function() {
      if (currentBreakingIndex > 0) {
        currentBreakingIndex--;
        updateBreakingNews();
      }
    });
  }
  
  if (breakingNext) {
    breakingNext.addEventListener('click', function() {
      if (currentBreakingIndex < totalBreakingNews - 1) {
        currentBreakingIndex++;
        updateBreakingNews();
      }
    });
  }
  
  // Initialize breaking news display
  updateBreakingNews();
})();
