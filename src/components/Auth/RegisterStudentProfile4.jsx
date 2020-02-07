import React, { Component } from "react";
import { Link } from "react-router-dom";
import Helmet from "react-helmet";
import { FormattedMessage } from "react-intl";
import ChangeCase from "change-case";
import _ from "lodash";
import { FilePond } from "react-filepond";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

import config from "../../config";
import http from "../../services/httpService";

import "filepond/dist/filepond.min.css";

class RegisterStudentProfil4 extends Component {
  state = {
    data: [],
    documentUpload: true,
    studentDocument: [],
    showModal: false,
    deleteFileId: 0,
    courseSession: 1,
    notification: []
  };

  async componentDidMount() {
    const studentData = localStorage.getItem("studentData");
    if (studentData) {
      const studentDataJSON = JSON.parse(studentData);
      if (
        typeof studentDataJSON.data.student_document !== "undefined" &&
        studentDataJSON.data.student_document.length > 0
      ) {
        const attachmentList = JSON.stringify(studentDataJSON.data.student_document);
        const { data: result } = await http.post(
          config.apiEndPoint + "attachment/list",
          { ids: attachmentList }
        );
        if (result.length) {
          var studentDocument = this.state.studentDocument;
          studentDocument = result.map(item => {
            const studentDoc = {
              source: item.id,
              options: {
                type: "limbo",
                file: {
                  name: item.filename_original,
                  size: item.filesize,
                  type: item.filetype
                }
              }
            };
            return studentDoc;
          });
          this.setState({ studentDocument: studentDocument });
          this.updatestudentDocumentList();
        } else {
          this.setState({ studentDocument: [] });
          this.updatestudentDocumentList();
        }
      }
    }
  }

  doSubmit = () => {
    const studentData = localStorage.getItem("studentData");
    if (studentData) {
      const studentDataJSON = JSON.parse(studentData);
      const { data } = this.state;
      studentDataJSON.data = _.assign({}, studentDataJSON.data, data);
      localStorage.setItem("studentData", JSON.stringify(studentDataJSON));
      this.props.history.push("/auth/student/profile/5");
    }
  };

  handleSubmit = e => {
    e.preventDefault();
    this.doSubmit();
  };

  handleSelectCourseSession = courseSession => {
    this.setState({ courseSession: courseSession});
  };

  hadleDocumentUploadContainer = e => {
    if (e.currentTarget.checked) {
      if (this.state.studentDocument.length && this.state.studentDocument.length > 0) {
        this.triggerDeleteDocumentAll();
      }
      this.setState({ documentUpload: false, studentDocument: [] }, () => {
        this.updatestudentDocumentList();
      });
    }
    else this.setState({ documentUpload: true });
  };

  handleUploadNewFiles = () => {
    this.pond.browse();
  };

  showModal = () => {
    this.setState({ showModal: true, deleteFileId: 0 });
  };

  hideModal = () => {
    this.setState({ showModal: false, deleteFileId: 0 });
  };

  confirmDeleteDocument = (fileId) => {
    this.showModal();
    this.setState({ deleteFileId: fileId });
  };

  triggerDeleteDocument = () => {
    const fileId = this.state.deleteFileId;
    this.setState({ showModal: false, deleteFileId: 0 }, () => {
      this.pond.removeFile(fileId);
      this.pond.processFile(fileId).then(file => {
        this.hideModal();
      }).catch(error => {
        console.log('error : ', error);
        this.hideModal();
      });
    });
  };

  triggerDeleteDocumentAll = () => {
    const { studentDocument } = this.state;
    for (var i = 0; i < studentDocument.length; i++) {
      const fileId = studentDocument[i].id;
      this.pond.removeFile(fileId);
      this.pond.processFile(fileId).then(file => { }).catch(error => {
        console.log('error : ', error);
        this.hideModal();
      });
    }
  };

  showError(message) {
    const notification = { ...this.state.notification };
    notification.message = message;
    this.setState({ notification });
  }

  updatestudentDocumentList = () => {
    const { studentDocument } = this.state;
    const studentData = localStorage.getItem("studentData");
    const studentDataJSON = JSON.parse(studentData);
    studentDataJSON.data.student_document = studentDocument.map(item => item.serverId);
    localStorage.setItem("studentData", JSON.stringify(studentDataJSON));
  };

  render() {
    return (
      <React.Fragment>
        <FormattedMessage id="student">
          {title => (
            <Helmet>
              <title>
                {ChangeCase.titleCase(title)} | {config.appName}
              </title>
            </Helmet>
          )}
        </FormattedMessage>
        <section className="section-content container">
          <div className="row m-0">
            <div id="box_lay_6" className="col-md-6 offset-md-3 p-0">
              <div id="box_main_form_info" className="box-form with-shadow">
                <div className="bg-white box-pdd box-border">
                  <h2 className="form-title text-center">
                    Création d'un compte étudiant
                  </h2>
                  <div className="position-relative text-center">
                    <ul className="box-progress">
                      <li className="active" />
                      <li className="active" />
                      <li />
                    </ul>
                  </div>
                  <form
                    className="my-form box-form-pdd"
                    onSubmit={this.handleSubmit}
                  >
                    {this.state.notification.message && (
                      <div className="alert alert-warning">
                        {this.state.notification.message}
                      </div>
                    )}
                    <div className="form-group in-group">
                      <label className="text-bold">
                        Choisissez votre prochaine session de formation en ligne
                      </label>
                      <div className="d-flex">
                        <button
                          type="button"
                          onClick={() => this.handleSelectCourseSession(1)}
                          className={"btn text-uppercase w-50 mr-2 " + ((this.state.courseSession === 1) ? "btn-purple" : "btn-transaprent-border-purple")}
                        >
                          AOUT 2019
                        </button>
                        <button
                          type="button"
                          onClick={() => this.handleSelectCourseSession(2)}
                          className={"btn text-uppercase w-50 " + ((this.state.courseSession === 2) ? "btn-purple" : "btn-transaprent-border-purple")}
                        >
                          FEVRIER 2020
                        </button>
                      </div>
                    </div>
                    <div className="form-group in-group">
                      <label className="text-bold">
                        Merci de télécharger les documents suivants :
                      </label>
                      <p className="mb-1">
                        <small className="mt-0">
                          - Photocopie de votre pièce d'identité
                        </small>
                      </p>
                      <div className="checkbox-custom" style={{marginTop: '30px'}}>
                        <input
                          type="checkbox"
                          onChange={this.hadleDocumentUploadContainer}
                        />
                        <label>Je les enverrai par la suite</label>
                      </div>
                    </div>
                    {this.state.documentUpload && (
                      <div className="form-group file-upload-container">
                        <FilePond
                          name="student-document"
                          value="1234"
                          labelIdle='Déposer vos fichiers ici ou <span class="filepond--label-action"> télécharger </span>'
                          labelFileProcessingComplete="téléchargement complet"
                          labelFileProcessing="téléchargement"
                          labelButtonRemoveItem="supprimer"
                          ref={ref => (this.pond = ref)}
                          files={this.state.studentDocument}
                          allowMultiple={true}
                          forceRevert={true}
                          server={{
                            url: config.apiEndPoint + "attachment",
                            process: "/upload/student",
                            revert: "/remove"
                          }}
                          onupdatefiles={fileItems => {
                            this.setState(
                              {
                                studentDocument: fileItems.map(
                                  fileItem => fileItem
                                )
                              },
                              () => {
                                this.updatestudentDocumentList();
                              }
                            );
                          }}
                          onprocessfiles={files => {
                            this.updatestudentDocumentList();
                          }}
                          beforeRemoveFile={async file => {
                            this.confirmDeleteDocument(file.id);
                            return false;
                          }}
                        />
                        <span
                          className="add-file-button"
                          onClick={this.handleUploadNewFiles}
                        />
                      </div>
                    )}
                    <div className="box-form-button pt-4 mx-auto text-center d-flex">
                      <Link
                        to="/auth/student/profile/3"
                        className="btn btn-transaprent-border-purple text-uppercase w-50 mr-2"
                      >
                        retour
                      </Link>
                      <button
                        type="submit"
                        onClick={this.props.handleStep}
                        className="btn btn-purple text-uppercase w-50"
                      >
                        suvant
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
        <Modal isOpen={this.state.showModal}>
          <ModalHeader toggle={this.hideModal}></ModalHeader>
          <ModalBody>
            <p style={{ textAlign: 'center' }}>
              Êtes-vous sûr de supprimer ce document ?
            </p>
          </ModalBody>
          <ModalFooter>
            <Button className="btn-yes" onClick={this.triggerDeleteDocument}>Oui</Button>
            <Button className="btn-no" onClick={this.hideModal}>Non</Button>
          </ModalFooter>
        </Modal>
      </React.Fragment>
    );
  }
}

export default RegisterStudentProfil4;
