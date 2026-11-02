// Shared folder-based intake for project documents and talent documents.
function sourceFolder(type){const cfg=db.importFolders[type];return FOLDER_SEED[type].find(f=>f.id===cfg.folderId);}
function loadedSourceFiles(type){const cfg=db.importFolders[type];if(!cfg.loadedFolderId||cfg.loadedFolderId!==cfg.folderId)return[];return db.sourceFiles.filter(f=>f.type===type&&f.folderIds.includes(cfg.loadedFolderId));}
function visibleSourceFiles(type){const status=sourceUI[type].status;return loadedSourceFiles(type).filter(f=>!status||f.status===status);}
function canParse(file){return file.status==='未取込'||file.status==='解析失敗';}
function intakeSteps(stage){return`<div class="intake-steps">${['フォルダ指定','読み込み・ファイル選択','解析結果の確認・編集','登録・マッチングへ'].map((s,i)=>`<div class="intake-step ${i===stage?'active':i<stage?'done':''}"><span>${i<stage?icon('check'):i+1}</span>${s}</div>`).join('')}</div>`;}
function folderImportPage(type){
  const job=type==='job',label=job?'案件':'人材',cfg=db.importFolders[type],folder=sourceFolder(type),ui=sourceUI[type];
  const loaded=!!folder&&cfg.loadedFolderId===folder.id;
  return head(`${label}資料取り込み`,'営業担当者が保存した資料を、指定フォルダから読み込んで整理します。',btn(icon('plus')+'手動で登録','new',`data-type="${type}"`),job?'PROJECT DOCUMENTS':'TALENT DOCUMENTS')+
  intakeSteps(loaded?1:0)+
  `<div class="intake-workflow"><div><span class="workflow-icon">${icon('users')}</span><span><b>営業担当者が資料を保存</b><small>メール・スキルシートをPCのフォルダへ</small></span></div>${icon('arrow','workflow-arrow')}<div><span class="workflow-icon blue">${icon('folder')}</span><span><b>ツールで読み込み・AI抽出</b><small>対象ファイルを選択して解析（デモ）</small></span></div>${icon('arrow','workflow-arrow')}<div><span class="workflow-icon green">${icon('checkfile')}</span><span><b>内容を確認して登録</b><small>登録した案件・人材をマッチングに活用</small></span></div></div>
  <section class="panel folder-panel"><div class="panel-head"><h2>${icon('folder')}取り込み元フォルダ</h2><span class="pill blue">サンプルフォルダ</span></div><div class="panel-body"><div class="folder-location"><span class="folder-large">${icon('folder')}</span><div class="folder-location-text"><div class="folder-label">${label}資料の保存先</div>${folder?`<strong>${e(folder.path)}</strong><span class="tiny muted">${e(folder.description)}</span>`:`<strong class="folder-placeholder">フォルダが指定されていません</strong><span class="tiny muted">「フォルダを選択」から、デモ用の保存先を指定してください。</span>`}</div><div class="actions">${btn(icon('folder')+(folder?'フォルダを変更':'フォルダを選択'),'source-choose-folder',`data-type="${type}" ${ui.busy?'disabled':''}`)}${btn(icon('refresh')+(ui.busy==='reading'?'読み込み中…':loaded?'再読み込み':'フォルダを読み込む'),'source-load',`data-type="${type}" ${!folder||ui.busy?'disabled':''}`,'primary')}</div></div><div class="folder-status"><span>${icon('shield')}デモ専用の架空フォルダです。実際のPCへのアクセス・ファイル送信は行いません。</span>${loaded?`<span class="good">${icon('check')}最終読み込み ${e(cfg.lastRead)}</span>`:folder?'<span class="warn">指定済み / まだ読み込んでいません</span>':''}</div></div></section>
  ${ui.busy==='reading'?loading('指定したフォルダを読み込んでいます','保存済みファイルと取り込み状況を確認しています。'):loaded?sourceFilePanel(type):`<section class="panel folder-empty"><div class="upload-icon">${icon('folder')}</div><h2>${folder?'フォルダを読み込んで、対象ファイルを確認':'まずは、資料の保存フォルダを指定'}</h2><p>${folder?'「フォルダを読み込む」を押すと、保存されたサンプル資料の一覧が表示されます。':'案件・人材の資料を営業担当者がPCに保存し、そのフォルダを指定する想定です。'}<br>このモックでは、用意したサンプルフォルダで一連の操作を体験できます。</p><div class="folder-prep"><span>${icon('mail')}保存したメール</span><span>${icon('file')}${job?'案件概要の資料':'スキルシート'}</span><span>${icon('checkfile')}取り込み状況を管理</span></div></section>`}
  <div class="intake-bottom"><div>${icon('help')}<span><b>営業担当者が、先に資料を保存する運用です。</b> 指定するのはPC上の保存フォルダを想定しています。メールアプリ内のフォルダを直接指定する画面ではありません。</span></div><div>${icon('spark')}<span>解析後は必ず内容を確認・修正してから登録します。マッチングは、登録済みの案件・人材に対して別の画面で実行します。</span></div></div>`;
}
function sourceFilePanel(type){
  const ui=sourceUI[type],files=loadedSourceFiles(type),rows=visibleSourceFiles(type),eligible=rows.filter(canParse),selected=files.filter(f=>ui.checked.includes(f.id)&&canParse(f));
  const allSelected=eligible.length>0&&eligible.every(f=>ui.checked.includes(f.id));
  const last=db.sourceFiles.filter(f=>ui.lastBatch.includes(f.id));const remaining=last.filter(f=>f.status==='確認待ち').length;
  return`${last.length?`<div class="batch-success" role="status"><span>${icon('checkfile')}</span><div><b>${last.length}件の資料から情報を抽出しました</b><p>${remaining?`${remaining}件が確認待ちです。内容を確認・修正してから登録してください。`:'抽出した情報はすべて登録済みです。'}</p></div>${btn('抽出結果を確認 '+icon('arrow'),'source-review-batch',`data-type="${type}" ${remaining?'':'disabled'}`,'small')}</div>`:''}<section class="panel source-files"><div class="panel-head"><h2>${icon('file')}フォルダ内のファイル <span class="pill">${files.length}件</span></h2><span class="sub">${ui.busy==='parsing'?'解析中':'保存済みの資料から選択'}</span></div><div class="source-summary"><span>未取込 <b>${files.filter(f=>f.status==='未取込').length}</b></span><span class="warn">確認待ち <b>${files.filter(f=>f.status==='確認待ち').length}</b></span><span class="good">登録済み <b>${files.filter(f=>f.status==='登録済').length}</b></span><span class="bad">解析失敗 <b>${files.filter(f=>f.status==='解析失敗').length}</b></span></div>${ui.busy==='parsing'?`<div class="panel-body">${loading(`${selected.length}件の資料を解析しています`,'ファイルの内容からスキル・単価・参画条件を抽出しています。')}</div>`:`<div class="toolbar"><label class="source-select-all"><input type="checkbox" data-source-all="true" data-type="${type}" ${allSelected?'checked':''} ${eligible.length?'':'disabled'}>未取込・解析失敗をすべて選択</label><div class="filters"><select aria-label="ファイルの取り込み状況" data-source-status="true" data-type="${type}"><option value="">すべての状況</option>${['未取込','確認待ち','登録済','解析失敗'].map(s=>`<option ${ui.status===s?'selected':''}>${s}</option>`).join('')}</select>${btn('選択を解除','source-clear',`data-type="${type}" ${selected.length?'':'disabled'}`,'small')}${btn(icon('spark')+'選択したファイルを解析','source-parse',`data-type="${type}" ${selected.length?'':'disabled'}`,'small primary')}</div></div>${rows.length?`<div class="table-wrap"><table><thead><tr><th class="source-checkbox-cell"></th><th>ファイル名</th><th>種類 / サイズ</th><th>更新日時</th><th>取り込み状況</th><th>操作</th></tr></thead><tbody>${rows.map(f=>`<tr class="${ui.checked.includes(f.id)?'source-selected':''}"><td class="source-checkbox-cell"><input type="checkbox" aria-label="${e(f.name)}を解析対象に選択" data-source-check="${e(f.id)}" data-type="${type}" ${ui.checked.includes(f.id)?'checked':''} ${canParse(f)?'':'disabled'}></td><td><div class="row-title"><span class="source-doc-icon ${f.extension.toLowerCase()}">${icon(f.extension==='EML'?'mail':'file')}</span><div><strong>${e(f.name)}</strong><small>${e(f.id)} · 架空のサンプル資料</small></div></div></td><td><span class="pill">${e(f.extension)}</span><br><span class="tiny muted">${e(f.size)}</span></td><td>${e(f.updated)}</td><td>${badge(f.status)}</td><td><div class="actions">${btn('プレビュー','source-preview',`data-type="${type}" data-id="${e(f.id)}"`,'small')}${f.status==='確認待ち'?btn('確認・編集','source-review',`data-type="${type}" data-id="${e(f.id)}"`,'small primary'):f.status==='解析失敗'?'<span class="tiny warn">選択して再解析できます</span>':''}</div></td></tr>`).join('')}</tbody></table></div>`:`<div class="empty">${icon('file')}<h3>この状況のファイルはありません</h3><p>「すべての状況」に切り替えると、フォルダ内の資料を確認できます。</p></div>`}<div class="source-actionbar"><div><strong>${selected.length}件を選択中</strong><small>解析した情報は「確認待ち」に入り、登録するまで一覧やマッチングに反映されません。</small></div>${btn(icon('spark')+`選択した${selected.length}件を解析`,'source-parse',`data-type="${type}" ${selected.length?'':'disabled'}`,'primary')}</div>`}</section>`;
}
function chooseSourceFolder(type){const folder=sourceFolder(type);openModal(`${type==='job'?'案件':'人材'}資料のフォルダを選択`,'営業担当者が資料を保存したPCフォルダを指定する想定です。',`<div class="panel-body"><div class="data-banner">${icon('shield')}このモックでは、以下の架空フォルダのみ選択できます。</div>${FOLDER_SEED[type].map(f=>`<div class="folder-choice ${folder?.id===f.id?'chosen':''}"><div class="row-title"><span class="folder-large">${icon('folder')}</span><div><h3>${e(f.label)} ${folder?.id===f.id?'<span class="pill green">指定中</span>':''}</h3><strong>${e(f.path)}</strong><p>${e(f.description)} / ${db.sourceFiles.filter(x=>x.folderIds.includes(f.id)).length}ファイル</p></div></div>${btn('このフォルダを指定','source-set-folder',`data-type="${type}" data-id="${e(f.id)}"`,'small primary')}</div>`).join('')}<div class="note-box">実ファイルのアップロードや、メールサービスへの接続は行いません。選択後に「フォルダを読み込む」を押してください。</div></div>`);}
async function readSourceFolder(type){
  const folder=sourceFolder(type),ui=sourceUI[type];if(!folder||ui.busy)return;const version=sourceOpVersion;ui.busy='reading';ui.checked=[];ui.lastBatch=[];renderView();
  await new Promise(r=>setTimeout(r,850));if(version!==sourceOpVersion)return;
  const cfg=db.importFolders[type];cfg.loadedFolderId=folder.id;cfg.lastRead=new Date().toLocaleTimeString('ja-JP',{hour:'2-digit',minute:'2-digit'});ui.busy=null;ui.status='';persist();if(page===(type==='job'?'mail':'import'))renderView();toast('フォルダを読み込みました。解析するファイルを選択してください。');
}
async function parseSourceFiles(type){
  const ui=sourceUI[type];if(ui.busy)return;const selected=loadedSourceFiles(type).filter(f=>ui.checked.includes(f.id)&&canParse(f));if(!selected.length)return;
  const version=sourceOpVersion,folder=sourceFolder(type);ui.busy='parsing';ui.lastBatch=[];renderView();
  await new Promise(r=>setTimeout(r,1400));if(version!==sourceOpVersion)return;
  const revs=[];
  for(const file of selected){
    // One review record per document prevents double registration on retries.
    if(db.pending.some(r=>r.fileId===file.id)){file.status='確認待ち';continue;}
    const rev={id:`REV-${file.id}-${Date.now()}`,type,fileId:file.id,data:clone(file.data),source:`${folder.path}\\${file.name}`};
    db.pending.push(rev);file.status='確認待ち';revs.push(rev);
  }
  ui.busy=null;ui.checked=[];ui.lastBatch=selected.map(f=>f.id);activity(`${type==='job'?'案件':'人材'}資料${selected.length}件から情報を抽出しました`,'review');
  if(page===(type==='job'?'mail':'import')){shell();if(revs.length===1)openEditor(type,revs[0].data,{pendingId:revs[0].id});}
  toast(`${selected.length}件の解析が完了しました。抽出結果を確認してから登録してください。`);
}
function previewSourceFile(id){const file=db.sourceFiles.find(f=>f.id===id);if(!file)return;const d=file.data,job=file.type==='job';let content;
  if(file.extension==='EML'){
    const body=job?`営業ご担当者さま\n\n下記案件にご参画可能な方をご紹介ください。\n\n■ 案件名：${d.name}\n■ 概要：${d.summary}\n■ 必須スキル：${d.skills.join(' / ')}\n■ 尚可スキル：${d.nice.join(' / ')}\n■ 単価：${d.price?`〜${d.price}万円/月`:'別途ご相談'}\n■ 勤務地：${d.place} / ${d.remote}\n■ 開始：${date(d.start)}\n■ 期間：${d.period}\n■ 備考：${d.memo}\n\n※ 営業担当者がPCに保存した架空のメールです。`:`営業ご担当者さま\n\n下記の人材をご紹介いたします。\n\n■ 氏名：${d.name}（架空）\n■ スキル：${d.skills.join(' / ')}\n■ 経験：${d.years}年\n■ 希望単価：${d.price}万円\n■ 希望：${d.remote}\n■ 参画可能時期：${date(d.start)}\n\n※ 営業担当者がPCに保存した架空の人材紹介メールです。`;
    content=`<span class="pill blue">保存済みメールのサンプル</span><h3 class="source-preview-heading">${e(d.name)}</h3><pre class="source-preview-body">${e(body)}</pre>`;
  }else{
    content=`<div class="edit-alert">${icon('file')}<div><b>資料内容のサンプルプレビュー</b>架空ファイルの内容を表示しています。実ファイルの解析・表示は行いません。</div></div><div class="detail-hero"><h3>${e(d.name)}${job?'':'（架空）'}</h3><p>${e(job?d.summary:d.memo)}</p></div><div class="detail-grid">${fieldDisplay(job?'必須スキル':'保有スキル',tags(d.skills),true)}${!job?fieldDisplay('技術経験',d.skills.map((s,i)=>`${e(s)} ${d.skillYears[i]}年`).join(' / '),true):fieldDisplay('尚可スキル',tags(d.nice),true)}${fieldDisplay(job?'単価上限':'希望単価',d.price?`${d.price}万円 / 月`:'未記載・要確認')}${fieldDisplay('参画時期',date(d.start))}${fieldDisplay(job?'勤務地':'希望勤務地',e(d.place))}${fieldDisplay('リモート条件',e(d.remote))}</div>`;
  }
  const rev=db.pending.find(r=>r.fileId===id);
  openDrawer('ファイルのプレビュー',`${e(file.name)} / ${e(file.extension)} / ${e(file.size)}`,content,btn('閉じる','close')+(rev?btn('抽出結果を確認','source-review',`data-type="${file.type}" data-id="${e(file.id)}"`,'primary'):canParse(file)?btn('このファイルを解析','source-parse-one',`data-type="${file.type}" data-id="${e(file.id)}"`,'primary'):badge('登録済')));
}
function handleSourceAction(action,type,id){
  const ui=sourceUI[type];if(!ui)return;
  if(action==='source-preview')return previewSourceFile(id);
  if(action==='source-review'){const rev=db.pending.find(r=>r.fileId===id);if(rev)return openEditor(rev.type,rev.data,{pendingId:rev.id});return go('review');}
  if(action==='source-review-batch'){reviewTab=type;return go('review');}
  if(ui.busy)return;
  if(action==='source-choose-folder')return chooseSourceFolder(type);
  if(action==='source-set-folder'){
    if(!FOLDER_SEED[type].some(f=>f.id===id))return;
    const cfg=db.importFolders[type];if(cfg.folderId!==id){cfg.folderId=id;cfg.loadedFolderId=null;cfg.lastRead=null;ui.checked=[];ui.status='';ui.lastBatch=[];}
    persist();closeModal();renderView();return toast('保存フォルダを指定しました。次にフォルダを読み込んでください。');
  }
  if(action==='source-load')return readSourceFolder(type);
  if(action==='source-clear'){ui.checked=[];return renderView();}
  if(action==='source-parse')return parseSourceFiles(type);
  if(action==='source-parse-one'){ui.checked=[id];closeModal();return parseSourceFiles(type);}
}
