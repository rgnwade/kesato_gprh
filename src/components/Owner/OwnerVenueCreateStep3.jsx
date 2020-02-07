import React, { Component } from "react";
import { Link } from "react-router-dom";
import Helmet from "react-helmet";
import { FormattedMessage } from "react-intl";
import ChangeCase from "change-case";
import Joi from "joi-browser";
import _ from "lodash";
import { FilePond } from "react-filepond";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { addDays } from "date-fns";

import config from "../../config";
import http from "../../services/httpService";
import DatePicker from "../Common/DatePicker";

import "filepond/dist/filepond.min.css";

class OwnerVenueCreateStep3 extends Component {
  state = {
    data: [],
    documentUpload: true,
    venueDocument: [],
    showModal: false,
    deleteFileId: 0,
    selectedDate: addDays(new Date(), 1),
    notification: []
  };

  async componentDidMount() {
    const createVenueData = localStorage.getItem("createVenueData");
    if (createVenueData) {
      const venueData = JSON.parse(createVenueData);
      if (typeof venueData.data.membership_start_date === "undefined") {
        this.setState({
          data: venueData.data
        });
      } else {
        this.setState({
          data: venueData.data,
          selectedDate: venueData.data.membership_start_date
        });
      }
      if (
        typeof venueData.data.venue_document !== "undefined" &&
        venueData.data.venue_document.length > 0
      ) {
        const attachmentList = JSON.stringify(venueData.data.venue_document);
        const { data: result } = await http.post(
          config.apiEndPoint + "attachment/list",
          { ids: attachmentList }
        );
        if (result.length) {
          var venueDocument = this.state.venueDocument;
          venueDocument = result.map(item => {
            const venueDoc = {
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
            return venueDoc;
          });
          this.setState({ venueDocument: venueDocument });
          this.updateVenueDocumentList();
        } else {
          this.setState({ venueDocument: [] });
          this.updateVenueDocumentList();
        }
      }
    }
  }

  schema = {
    membership_day: Joi.string()
      .required()
      .error(new Error("Jour requis!")),
    membership_month: Joi.string()
      .required()
      .error(new Error("Mois requis!")),
    membership_year: Joi.string()
      .required()
      .error(new Error("Anée requis!"))
  };

  doSubmit = () => {
    const createVenueData = localStorage.getItem("createVenueData");
    if (createVenueData) {
      const venueData = JSON.parse(createVenueData);
      const { data } = this.state;
      data.membership_start_date = this.state.selectedDate;
      venueData.data = _.assign({}, venueData.data, data);
      localStorage.setItem("createVenueData", JSON.stringify(venueData));
      this.props.history.push("/owner/venue/create/step/4");
    }
  };

  handleSubmit = e => {
    e.preventDefault();
    this.doSubmit();
  };

  handleChange = e => {
    //
  };

  handleChangeDatePicker = date => {
    this.setState({ selectedDate: date });
  };

  hadleDocumentUploadContainer = e => {
    if (e.currentTarget.checked) {
      if (this.state.venueDocument.length && this.state.venueDocument.length > 0) {
        this.triggerDeleteDocumentAll();
      }
      this.setState({ documentUpload: false, venueDocument: [] }, () => {
        this.updateVenueDocumentList();
      });
    }
    else this.setState({ documentUpload: true });
  };

  handleUploadNewFiles = () => {
    this.pond.browse();
  };

  handleSubmitStates = () => {
    const pond = document.querySelector('.filepond--root');
    pond.addEventListener('FilePond:processfileprogress', e => {
    console.log('File added', e.detail);
});
}

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
        // console.log('error : ', error);
        this.hideModal();
      });
    });
  };

  triggerDeleteDocumentAll = () => {
    const { venueDocument } = this.state;
    for (var i = 0; i < venueDocument.length; i++) {
      const fileId = venueDocument[i].id;
      this.pond.removeFile(fileId);
      this.pond.processFile(fileId).then(file => { }).catch(error => {
        // console.log('error : ', error);
        this.hideModal();
      });
    }
  };

  showError(message) {
    const notification = { ...this.state.notification };
    notification.message = message;
    this.setState({ notification });
  }

  updateVenueDocumentList = () => {
    const { venueDocument } = this.state;
    const createVenueData = localStorage.getItem("createVenueData");
    const venueData = JSON.parse(createVenueData);
    venueData.data.venue_document = venueDocument.map(item => item.serverId);
    localStorage.setItem("createVenueData", JSON.stringify(venueData));
  };

  render() {
    return (
      <React.Fragment>
        <FormattedMessage id="createVenue">
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
                    Ajout d'un établissement
                  </h2>
                  <div className="position-relative text-center">
                    <ul className="bar-progress">
                      <li className="active">
                        <div className="icon">
                          <i className="fa fa-user-o" aria-hidden="true" />
                        </div>
                        <p>Coordonnées</p>
                      </li>
                      <li className="active">
                        <div className="icon">
                          <i className="fa fa-envelope-o" aria-hidden="true" />
                        </div>
                        <p>Contact</p>
                      </li>
                      <li className="active">
                        <div className="icon">
                          <i
                            className="fa fa-calendar-check-o"
                            aria-hidden="true"
                          />
                        </div>
                        <p>Information</p>
                      </li>
                      <li>
                        <div className="icon">
                          <i className="fa fa-eye" aria-hidden="true" />
                        </div>
                        <p>Récapitulatif</p>
                      </li>
                      <li>
                        <div className="icon">
                          <i className="fa fa-cart-plus" aria-hidden="true" />
                        </div>
                        <p>Cotisation</p>
                      </li>
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
                        A quelle date souhaité vous que l'adhésion débute ?
                      </label>
                      <DatePicker
                        inputNameDay="membership_day"
                        inputNameMonth="membership_month"
                        inputNameYear="membership_year"
                        inputPlaceholderDay="Jour*"
                        inputPlaceholderMonth="Mois*"
                        inputPlaceholderYear="Anée*"
                        selectedDate={this.state.selectedDate}
                        minDate={addDays(new Date(), 1)}
                        dateFormatDay="dd"
                        dateFormatMonth="MMMM"
                        dateFormatYear="yyyy"
                        onChange={this.handleChangeDatePicker}
                        locale="fr"
                      />
                    </div>
                    <div className="form-group in-group">
                      <label className="text-bold">
                        Merci de télécharger les documents suivants
                      </label>
                      <p className="mb-1">
                        <small className="mt-0">
                          - Photocopie de la pièce d'identité du Gérant
                        </small>
                      </p>
                      <p>
                        <small className="mt-0">
                          - Votre attestation d'exploitation
                        </small>
                      </p>
                      {/* <div className="checkbox-custom">
                        <input
                          type="checkbox"
                          onChange={this.hadleDocumentUploadContainer}
                        />
                        <label>Je les enverrai par la suite</label>
                      </div> */}
                    </div>
                    {this.state.documentUpload && (
                      <div className="form-group file-upload-container">
                        <FilePond
                          name="venue-document"
                          labelIdle='Déposer vos fichiers ici ou <span class="filepond--label-action"> télécharger </span>'
                          labelFileProcessingComplete="téléchargement complet"
                          labelFileProcessing="téléchargement"
                          labelButtonRemoveItem="supprimer"
                          ref={ref => (this.pond = ref)}
                          files={this.state.venueDocument}
                          allowMultiple={true}
                          forceRevert={true}
                          server={{
                            url: config.apiEndPoint + "attachment",
                            process: "/upload/venue",
                            revert: "/remove"
                          }}
                          onupdatefiles={fileItems => {
                            this.setState(
                              {
                                venueDocument: fileItems.map(
                                  fileItem => fileItem
                                )
                              },
                              () => {
                                this.updateVenueDocumentList();
                              }
                            );
                          }}
                          onprocessfiles={files => {
                            this.updateVenueDocumentList();
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
                        to="/owner/venue/create/step/2"
                        className="btn btn-transaprent-border-purple text-uppercase w-50 mr-2"
                      >
                        retour
                      </Link>
                      <button
                        type="submit"
                        onClick={this.props.handleStep}
                        disabled={!this.state.venueDocument.length == 1}
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

export default OwnerVenueCreateStep3;
