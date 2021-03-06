import React from "react";
import PropTypes from "prop-types";
import Moment from "react-moment";
const ProfileEducation = ({
  education: { school, degree, fieldofStudy, location, current, to, from, description },
}) => (
  <div>
    <h3 className='text-dark'>{school}</h3>
    <p>
      <Moment format='YYYY/MM/DD'>{from}</Moment> -{" "}
      {!to ? "Now" : <Moment format='YYYY/MM/DD'>{to}</Moment>}
    </p>
    <p>
      <strong>Degree: </strong>
      {degree}
    </p>
    <p>
      <strong>Description: </strong>
      {description}
    </p>
    <p>
      <strong>Field of Study: </strong>
      {fieldofStudy}
    </p>
  </div>
);

ProfileEducation.propTypes = {
  eduction: PropTypes.array.isRequired,
};

export default ProfileEducation;
